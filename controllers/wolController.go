package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"sync"

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

type WolsRequest struct {
	Ids []int `json:"ids"`
}

func Wols(w http.ResponseWriter, r *http.Request) {
	var requestBody WolsRequest
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		http.Error(w, fmt.Sprintf("Invalid request body: %v", err), http.StatusBadRequest)
		return
	}

	idInts := requestBody.Ids

	var wg sync.WaitGroup
	results := make(map[string]map[string]string)
	resultChan := make(chan map[string]string, len(idInts))

	for _, id := range idInts {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()

			var computer models.Computer
			if err := database.DB.Where("id = ?", id).
				Preload("Network").
				First(&computer).Error; err != nil {
				resultChan <- map[string]string{
					"id":      fmt.Sprintf("%d", id),
					"status":  "failed",
					"message": fmt.Sprintf("Computer Not Found or you don't have permission: %v", err),
				}
				return
			}

			status := "success"
			if err := wol.WakeOnLan(computer.Mac, computer.Ip, computer.Network.NetworkAddress, computer.Port); err != nil {
				status = "failed"
				fmt.Println(computer.Mac, computer.Ip)
				fmt.Println("Error:", err)
				resultChan <- map[string]string{
					"id":      fmt.Sprintf("%d", id),
					"status":  status,
					"message": fmt.Sprintf("Fail to WOL: %v", err),
				}
				return
			}

			message, logErr := AddWakeLog(computer.Id, computer.UserId, status)
			if logErr != nil {
				resultChan <- map[string]string{
					"id":      fmt.Sprintf("%d", id),
					"status":  status,
					"message": fmt.Sprintf("Failed to add wake log: %v", logErr),
				}
				return
			}

			resultChan <- map[string]string{
				"id":      fmt.Sprintf("%d", id),
				"status":  status,
				"message": message,
			}
		}(id)
	}

	go func() {
		wg.Wait()
		close(resultChan)
	}()

	for result := range resultChan {
		results[result["id"]] = result
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(results)
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
