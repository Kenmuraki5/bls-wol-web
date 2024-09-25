package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"bls-wol-web/controllers"
	"bls-wol-web/database"
	"bls-wol-web/routes"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

type Worker struct {
	ID    int
	Redis *redis.Client
	Ctx   context.Context
}

func (w *Worker) Start(workerDone chan struct{}) {
	defer func() { workerDone <- struct{}{} }()

	for {
		select {
		case <-w.Ctx.Done():
			log.Printf("Worker %d stopped\n", w.ID)
			return
		default:
			// Check for tasks in Redis queue
			fmt.Println("start")
			task, err := w.Redis.BRPop(w.Ctx, 0, "computer_tasks").Result() // Blocking pop
			if err != nil {
				log.Printf("Worker %d: Error checking task queue: %v\n", w.ID, err)
				time.Sleep(5 * time.Second) // Wait before retrying
				continue
			}

			// Process the task (task[1] contains the task data)
			log.Printf("Worker %d processing task: %s\n", w.ID, task[1])
			controllers.CheckIPWorker(w.Redis, w.Ctx, task[1]) // Pass the task data if needed
		}
	}
}

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Get environment variables
	port := os.Getenv("PORT")
	jwtValidTime := os.Getenv("JWT_VALID_TIME")
	fmt.Println("jwt_valid_time:", jwtValidTime, "minutes")
	fmt.Println("PORT:", port)

	// Connect to the database
	database.Connect()
	database.InitRedis()

	// Initialize the router
	r := mux.NewRouter()
	routes.Setup(r, database.RedisClient)

	// Use CORS middleware
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)(r)

	// Create a context that can be cancelled
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Create the HTTP server
	srv := &http.Server{
		Addr:    ":" + port,
		Handler: corsHandler,
	}

	// Create a channel for shutting down workers
	workerDone := make(chan struct{})

	numWorkers := 10
	startWorkerPool(database.RedisClient, numWorkers, ctx, workerDone)

	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		log.Println("Server started at :" + port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Error starting server: %v", err)
		}
	}()

	select {
	case <-signalChan:
		log.Println("Received shutdown signal, cancelling workers...")
		cancel()
	case <-workerDone:
		log.Println("Worker has finished processing.")
	}

	log.Println("Shutting down server...")

	ctxShutdown, cancelShutdown := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancelShutdown()

	if err := srv.Shutdown(ctxShutdown); err != nil {
		log.Fatalf("Server Shutdown Failed:%+v", err)
	}

	log.Println("Server exited")
	log.Println("All workers stopped")
}

// Function to start the worker pool
func startWorkerPool(rdb *redis.Client, numWorkers int, ctx context.Context, workerDone chan struct{}) {
	for i := 0; i < numWorkers; i++ {
		worker := Worker{
			ID:    i,
			Redis: rdb,
			Ctx:   ctx,
		}
		go worker.Start(workerDone)
	}
}
