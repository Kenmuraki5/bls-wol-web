package routes

import (
	"bls-wol-web/controllers"
	"bls-wol-web/middleware"
	"net/http"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/mux"
)

// Setup function to configure routes
func Setup(r *mux.Router, redisClient *redis.Client) {
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
	r.HandleFunc("/api/updateDevice/{id:[0-9]+}", controllers.UpdateComputer).Methods("POST")
	r.HandleFunc("/api/computerr/{id:[0-9]+}", controllers.GetComputersByOrganizationId).Methods("GET")

	r.HandleFunc("/api/wols", controllers.Wols).Methods("POST")
	r.HandleFunc("/api/wol/{id:[0-9]+}", controllers.Wol).Methods("POST")
	r.HandleFunc("/api/wolClient", controllers.WolClient).Methods("POST")

	r.HandleFunc("/events/{userId:[0-9]+}", controllers.EventsHandler).Methods("GET")
	r.HandleFunc("/admin/{networkId:[0-9]+}", controllers.AdminMonitorByNetwork).Methods("GET")
	r.HandleFunc("/admin/devices", controllers.AdminMonitorAllDevices(redisClient)).Methods("GET")
	r.HandleFunc("/admin/wakeLog", controllers.GetWakeLogs).Methods("GET")

	r.HandleFunc("/api/wake-up-jobs", controllers.GetWakeUpJobs(redisClient)).Methods("GET")
	r.HandleFunc("/set-wake-up-time", controllers.SetWakeUpTime(redisClient)).Methods("POST")

	r.HandleFunc("/api/networks", controllers.AddComputer).Methods("POST")
	r.HandleFunc("/api/networks", controllers.GetNetworks).Methods("GET")
}
