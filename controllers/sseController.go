package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
	"time"

	"bls-wol-web/database"
	"bls-wol-web/models"

	"github.com/gorilla/mux"
)

func EventsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}
	vars := mux.Vars(r)
	userId := vars["userId"]

	for {
		var computers []models.Computer
		if err := database.DB.Where("user_id = ?", userId).Find(&computers).Error; err != nil {
			fmt.Println("Failed to retrieve computers:", err)
			http.Error(w, "Database query failed", http.StatusInternalServerError)
			return
		}

		results := make(chan models.Computer, len(computers))
		for _, computer := range computers {
			go func(computer models.Computer) {
				computer.Status = checkIPStatus(computer.Ip)
				results <- computer
			}(computer)
		}

		var updatedComputers []models.Computer
		for i := 0; i < len(computers); i++ {
			updatedComputers = append(updatedComputers, <-results)
		}

		message, err := json.Marshal(updatedComputers)
		if err != nil {
			fmt.Println("Failed to marshal data:", err)
			http.Error(w, "Data marshalling failed", http.StatusInternalServerError)
			return
		}

		fmt.Fprintf(w, "data: %s\n\n", message)
		flusher.Flush()

		time.Sleep(60 * time.Second)
	}
}

func AdminMonitor(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}
	vars := mux.Vars(r)
	networkId := vars["networkId"]

	fmt.Println(networkId)
	for {
		var computers []models.Computer
		if err := database.DB.Where("network_id = ?", networkId).Preload("Network").Find(&computers).Error; err != nil {
			fmt.Println("Failed to retrieve computers:", err)
			http.Error(w, "Database query failed", http.StatusInternalServerError)
			return
		}

		results := make(chan models.Computer, len(computers))
		for _, computer := range computers {
			go func(computer models.Computer) {
				computer.Status = checkIPStatus(computer.Ip)
				results <- computer
			}(computer)
		}

		var updatedComputers []models.Computer
		for i := 0; i < len(computers); i++ {
			updatedComputers = append(updatedComputers, <-results)
		}

		message, err := json.Marshal(updatedComputers)
		if err != nil {
			fmt.Println("Failed to marshal data:", err)
			http.Error(w, "Data marshalling failed", http.StatusInternalServerError)
			return
		}

		fmt.Fprintf(w, "data: %s\n\n", message)
		flusher.Flush()

		time.Sleep(60 * time.Second)
	}
}

func checkIPStatus(ip string) string {
	cmd := exec.Command("ping", "-c", "1", "-W", "2", ip)
	err := cmd.Run()
	if err != nil {
		return "offline"
	}
	return "online"
}
