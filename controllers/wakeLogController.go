package controllers

import (
	"bls-wol-web/database"
	"bls-wol-web/models"
	"encoding/json"
	"fmt"
	"net/http"
)

func AddWakeLog(computerId, userId uint, status string) (string, error) {
	if status == "" {
		status = "unknown"
	}

	wakeLog := models.WakeLog{
		ComputerId: computerId,
		UserId:     userId,
		Status:     status,
	}

	if err := database.DB.Create(&wakeLog).Error; err != nil {
		return "", fmt.Errorf("failed to add wake log: %v", err)
	}

	return "Wake log added successfully", nil
}

func GetWakeLogs(w http.ResponseWriter, r *http.Request) {
	var wakeLogs []models.WakeLog

	if err := database.DB.Preload("Computer").Find(&wakeLogs).Error; err != nil {
		http.Error(w, fmt.Sprintf("Failed to retrieve wake logs: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"data": wakeLogs,
	})
}
