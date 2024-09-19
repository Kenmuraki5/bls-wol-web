package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"bls-wol-web/database"
	"bls-wol-web/routes"

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
	// database.InitRedis()

	// Initialize the router
	r := mux.NewRouter()
	routes.Setup(r)

	// Use CORS middleware
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"Access-Control-Allow-Origin", "*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)(r)

	// Start the server
	fmt.Println("Server started at :" + port)
	err = http.ListenAndServe(":"+port, corsHandler)
	if err != nil {
		log.Fatalf("Error starting server: %v", err)
	}

	// numWorkers := 10 // จำนวน worker ที่จะรัน
	// ctx := context.Background()
	// for i := 0; i < numWorkers; i++ {
	// 	go controllers.SendMagicPacket(database.RedisClient, ctx)
	// }

	// รอให้ worker ทำงาน
	select {}
}
