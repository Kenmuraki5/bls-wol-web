package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"bls-wol-web/database"
	"bls-wol-web/models"
	"bls-wol-web/wol"

	"github.com/gorilla/mux"
)

func Wol(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	userId := "1"

	var computer models.Computer
	if err := database.DB.Where("id = ?", id).Where("user_id = ?", userId).
		Preload("Network").
		First(&computer).Error; err != nil {
		http.Error(w, fmt.Sprintf("Computer Not Found or you don't have permission: %v", err), http.StatusNotFound)
		return
	}

	if err := wol.WakeOnLan(computer.Mac, computer.Ip, computer.Network.NetworkAddress, computer.Port); err != nil {
		fmt.Println(computer.Mac, computer.Ip)
		fmt.Println("Error:", err)
		http.Error(w, fmt.Sprintf("Fail to WOL: %v", err), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "success"})
}

type WolRequest struct {
	MacAddress     string `json:"mac_address"`
	IpAddr         string `json:"ip_address"`
	NetworkAddress string `json:"network_address"`
	Port           uint32 `json:"port"`
}

func WolClient(w http.ResponseWriter, r *http.Request) {
	var reqBody WolRequest

	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	fmt.Println(reqBody)
	if err := wol.WakeOnLan(reqBody.MacAddress, reqBody.IpAddr, reqBody.NetworkAddress, reqBody.Port); err != nil {
		fmt.Println(reqBody.MacAddress, reqBody.IpAddr)
		fmt.Println("Error:", err)
		http.Error(w, fmt.Sprintf("Failed to WOL: %v", err), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "success"})
}
