package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"bls-wol-web/database"
	"bls-wol-web/models"
)

func AddComputer(w http.ResponseWriter, r *http.Request) {
	var data map[string]string
	uid := 1

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, fmt.Sprintf("Fail to parse body: %v", err), http.StatusBadRequest)
		return
	}

	if len(data["mac"]) != 17 && len(data["mac"]) != 12 {
		http.Error(w, "Wrong Mac Address Format", http.StatusBadRequest)
		return
	}

	userId, err := strconv.ParseUint(fmt.Sprintf("%v", uid), 10, 32)
	if err != nil {
		http.Error(w, fmt.Sprintf("Fail to parse userId: %v", err), http.StatusBadRequest)
		return
	}

	port, err := strconv.Atoi(data["port"])
	if err != nil {
		http.Error(w, fmt.Sprintf("Fail to convert port: %v", err), http.StatusInternalServerError)
		return
	}

	computer := models.Computer{
		UserId: uint(userId),
		Name:   data["name"],
		Mac:    data["mac"],
		Ip:     data["ip"],
		Port:   uint32(port),
	}

	if err := database.DB.Create(&computer).Error; err != nil {
		http.Error(w, fmt.Sprintf("Computer Exists, Try Another One: %v", err), http.StatusConflict)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"data": computer,
	})
}

func GetComputer(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	userId := 1
	var computer models.Computer

	if err := database.DB.Where("id = ?", id).Where("user_id = ?", userId).First(&computer).Error; err != nil {
		http.Error(w, fmt.Sprintf("Computer Not Found or you don't have permission: %v", err), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"data": computer,
	})
}

func GetComputers(w http.ResponseWriter, r *http.Request) {
	userId := 1
	var computers []models.Computer

	if err := database.DB.Where("user_id = ?", userId).Find(&computers).Error; err != nil {
		http.Error(w, fmt.Sprintf("Fail to Get Data: %v", err), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"data": computers,
	})
}

func GetComputersByOrganizationId(w http.ResponseWriter, r *http.Request) {
	organizationId := r.URL.Query().Get("id")

	var computers []models.Computer
	if err := database.DB.Where("network_id = ?", organizationId).Find(&computers).Error; err != nil {
		http.Error(w, fmt.Sprintf("Failed to retrieve computers: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":   "Successfully retrieved computers",
		"computers": computers,
	})
}

func DeleteComputer(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseUint(r.URL.Query().Get("id"), 10, 32)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid ID: %v", err), http.StatusBadRequest)
		return
	}

	userId := 1
	var computer models.Computer

	if err := database.DB.Where("id = ?", id).Where("user_id = ?", userId).First(&computer).Error; err != nil {
		http.Error(w, fmt.Sprintf("Data to delete may not exist: %v", err), http.StatusBadRequest)
		return
	}

	if err := database.DB.Where("id = ?", id).Where("user_id = ?", userId).Delete(&computer).Error; err != nil {
		http.Error(w, fmt.Sprintf("Fail to delete, record doesn't exists or you don't have permission: %v", err), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "success",
		"data":    computer,
	})
}

func UpdateComputer(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/updateDevice/")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid ID: %v", err), http.StatusBadRequest)
		return
	}

	userId := 1
	var computer models.Computer

	if err := database.DB.Where("id = ?", id).Where("user_id = ?", userId).First(&computer).Error; err != nil {
		http.Error(w, fmt.Sprintf("Computer not found or you don't have permission: %v", err), http.StatusNotFound)
		return
	}

	var data map[string]string
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, fmt.Sprintf("Fail to parse body: %v", err), http.StatusBadRequest)
		return
	}

	if newName, ok := data["name"]; ok {
		computer.Name = newName
	}
	if newMac, ok := data["mac"]; ok {
		if len(newMac) != 17 && len(newMac) != 12 {
			http.Error(w, "Wrong Mac Address Format", http.StatusBadRequest)
			return
		}
		computer.Mac = newMac
	}
	if newIp, ok := data["ip"]; ok {
		computer.Ip = newIp
	}
	if newPort, ok := data["port"]; ok {
		port, err := strconv.Atoi(newPort)
		if err != nil {
			http.Error(w, fmt.Sprintf("Fail to convert port: %v", err), http.StatusInternalServerError)
			return
		}
		computer.Port = uint32(port)
	}
	if networkId, ok := data["network_id"]; ok {
		port, err := strconv.Atoi(networkId)
		if err != nil {
			http.Error(w, fmt.Sprintf("Fail to convert port: %v", err), http.StatusInternalServerError)
			return
		}
		computer.NetworkID = int(port)
	}

	if err := database.DB.Save(&computer).Error; err != nil {
		http.Error(w, fmt.Sprintf("Failed to update computer: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Computer updated successfully",
		"data":    computer,
	})
}
