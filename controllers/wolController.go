package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"bls-wol-web/database"
	"bls-wol-web/models"
	"bls-wol-web/wol"

	"github.com/gorilla/mux"
)

func Wol(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]
	userIdStr := "1"

	userId, err := strconv.ParseUint(userIdStr, 10, 32)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid userId: %v", err), http.StatusBadRequest)
		return
	}

	var computer models.Computer
	if err := database.DB.Where("id = ?", idStr).Where("user_id = ?", userId).
		Preload("Network").
		First(&computer).Error; err != nil {
		http.Error(w, fmt.Sprintf("Computer Not Found or you don't have permission: %v", err), http.StatusNotFound)
		return
	}

	status := "success"
	if err := wol.WakeOnLan(computer.Mac, computer.Ip, computer.Network.NetworkAddress, computer.Port); err != nil {
		status = "failed"
		fmt.Println(computer.Mac, computer.Ip)
		fmt.Println("Error:", err)
		http.Error(w, fmt.Sprintf("Fail to WOL: %v", err), http.StatusBadRequest)
	}

	message, logErr := AddWakeLog(computer.Id, uint(userId), status)
	if logErr != nil {
		http.Error(w, fmt.Sprintf("Failed to add wake log: %v", logErr), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": message})
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
