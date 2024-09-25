package controllers

import (
	"bls-wol-web/database"
	"bls-wol-web/models"
	"encoding/json"
	"fmt"
	"net/http"
)

func AddNetwork(w http.ResponseWriter, r *http.Request) {
	var data map[string]string

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, fmt.Sprintf("Fail to parse body: %v", err), http.StatusBadRequest)
		return
	}

	network := models.Network{
		NetworkName:      data["network_name"],
		NetworkAddress:   data["network_address"],
		SubnetMask:       data["subnet_mask"],
		BroadcastAddress: data["broadcast_address"],
		Description:      data["description"],
	}

	if err := database.DB.Create(&network).Error; err != nil {
		http.Error(w, fmt.Sprintf("Computer Exists, Try Another One: %v", err), http.StatusConflict)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"data": network,
	})
}

func GetNetworks(w http.ResponseWriter, r *http.Request) {
	var network []models.Network

	if err := database.DB.Find(&network).Error; err != nil {
		http.Error(w, fmt.Sprintf("Computer Not Found or you don't have permission: %v", err), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"data": network,
	})
}
