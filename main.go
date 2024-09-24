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

	"bls-wol-web/database"
	"bls-wol-web/routes"
	"bls-wol-web/wol"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

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

	numWorkers := 10 // จำนวน worker ที่จะรัน
	for i := 0; i < numWorkers; i++ {
		go func() {
			wol.SendMagicPacket(database.RedisClient, ctx)
			workerDone <- struct{}{} // Notify when worker is done
		}()
	}

	// Setup signal handling to gracefully shutdown
	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, syscall.SIGINT, syscall.SIGTERM)

	// Start the server in a goroutine
	go func() {
		log.Println("Server started at :" + port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Error starting server: %v", err)
		}
	}()

	// Wait for shutdown signal
	select {
	case <-signalChan:
		log.Println("Received shutdown signal, cancelling workers...")
		cancel() // Cancel the context to stop workers
	case <-workerDone:
		log.Println("Worker has finished processing.")
	}

	// Wait for the context to be done
	log.Println("Shutting down server...")

	// Create a context with timeout for shutdown
	ctxShutdown, cancelShutdown := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancelShutdown()

	// Shutdown the server gracefully
	if err := srv.Shutdown(ctxShutdown); err != nil {
		log.Fatalf("Server Shutdown Failed:%+v", err)
	}

	log.Println("Server exited")
	log.Println("All workers stopped")
}
