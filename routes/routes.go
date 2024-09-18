package routes

import (
	"bls-wol-web/controllers"
	"bls-wol-web/middleware"
	"net/http"

	"github.com/gorilla/mux"
)

// Setup function to configure routes
func Setup(r *mux.Router) {
	// Middleware
	r.HandleFunc("/api/users/register", controllers.Register).Methods("POST")
	r.HandleFunc("/api/users/login", controllers.Login).Methods("POST")
	r.Handle("/api/users/user", middleware.IsAuthenticated(http.HandlerFunc(controllers.User))).Methods("GET")
	r.HandleFunc("/api/users/logout", controllers.Logout).Methods("POST")
	r.HandleFunc("/api/users/count", controllers.UserCount).Methods("GET")
	r.HandleFunc("/api/computers", controllers.GetComputers).Methods("GET")
	r.HandleFunc("/api/computers/{id:[0-9]+}", controllers.GetComputer).Methods("GET")
	r.HandleFunc("/api/computers", controllers.AddComputer).Methods("POST")
	r.HandleFunc("/api/computers/{id:[0-9]+}", controllers.DeleteComputer).Methods("DELETE")

	r.HandleFunc("/api/wol/{id:[0-9]+}", controllers.Wol).Methods("POST")
	r.HandleFunc("/api/wolClient", controllers.WolClient).Methods("POST")

	r.HandleFunc("/api/computerr/{id:[0-9]+}", controllers.GetComputersByOrganizationId).Methods("GET")

	r.HandleFunc("/events/{userId:[0-9]+}", controllers.EventsHandler).Methods("GET")
	r.HandleFunc("/admin/{networkId:[0-9]+}", controllers.AdminMonitor).Methods("GET")
	// r.HandleFunc("/admin/{networkId:[0-9]+}", controllers.AdminMonitor2).Methods("GET")
	// // WebSocket handlers
	// r.HandleFunc("/ws", websocket.Handler(controllers.HandleWebSocket))
	// r.HandleFunc("/sse/{userId:[0-9]+}", websocket.Handler(controllers.HandleWebSocket2))
}
