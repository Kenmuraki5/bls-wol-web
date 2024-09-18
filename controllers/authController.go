package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"bls-wol-web/database"
	"bls-wol-web/middleware"
	"bls-wol-web/models"

	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

func Register(w http.ResponseWriter, r *http.Request) {
	var data map[string]string

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Check if one user exists, if exists disallow sign up
	var count int64
	if err := database.DB.Model(&models.User{}).Count(&count).Error; err != nil {
		http.Error(w, "Internal Server Error, DB Error", http.StatusInternalServerError)
		return
	}

	numUserAllowed, err := strconv.Atoi(os.Getenv("NUM_USER_ALLOWED"))
	if err != nil {
		http.Error(w, "Fail to parse NUM_USER_ALLOWED env variable", http.StatusInternalServerError)
		return
	}

	if count >= int64(numUserAllowed) {
		http.Error(w, fmt.Sprintf("Not allowed to add more than %d users", numUserAllowed), http.StatusForbidden)
		return
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), bcrypt.DefaultCost)

	if len(data["username"]) < 1 || len(data["password"]) < 1 {
		http.Error(w, "invalid username or password", http.StatusBadRequest)
		return
	}

	user := models.User{
		Username: data["username"],
		Password: password,
	}

	if err := database.DB.Create(&user).Error; err != nil {
		http.Error(w, "Username Exists, Try Another One", http.StatusConflict)
		return
	}

	response := map[string]interface{}{
		"message": "success",
		"data":    user,
	}
	json.NewEncoder(w).Encode(response)
}

func UserCount(w http.ResponseWriter, r *http.Request) {
	numUserAllowed, err := strconv.Atoi(os.Getenv("NUM_USER_ALLOWED"))
	if err != nil {
		http.Error(w, "Fail to parse NUM_USER_ALLOWED env variable", http.StatusInternalServerError)
		return
	}

	var count int64
	if err := database.DB.Model(&models.User{}).Count(&count).Error; err != nil {
		http.Error(w, "Internal Server Error, DB Error", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"message": "success",
		"data": map[string]interface{}{
			"num_user_allowed": numUserAllowed,
			"user_count":       count,
		},
	}
	json.NewEncoder(w).Encode(response)
}

func CreateToken(id uint, username string, validMinutes uint) (string, error) {
	expirationTime := time.Now().Add(time.Minute * time.Duration(validMinutes))
	claims := &middleware.AuthClaims{
		Username: username,
		Id:       strconv.Itoa(int(id)),
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return tokenString, err
	}
	return tokenString, nil
}

func Login(w http.ResponseWriter, r *http.Request) {
	var data map[string]string

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, "Fail to Parse Request Body", http.StatusBadRequest)
		return
	}

	var user models.User
	if err := database.DB.Where("username = ?", data["username"]).First(&user).Error; err != nil {
		http.Error(w, "User Not Found", http.StatusNotFound)
		return
	}

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"])); err != nil {
		http.Error(w, "Incorrect Password", http.StatusForbidden)
		return
	}

	validTimeMinutes := os.Getenv("JWT_VALID_TIME")
	validMinutes, err := strconv.ParseInt(validTimeMinutes, 10, 32)
	if err != nil {
		http.Error(w, "Server Error related to JWT", http.StatusInternalServerError)
		return
	}

	token, err := CreateToken(user.Id, user.Username, uint(validMinutes))
	if err != nil {
		http.Error(w, "Could not Login, Server Error related to JWT", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Minute * time.Duration(validMinutes)),
		HttpOnly: false,
	})

	response := map[string]interface{}{
		"message": "success",
		"data":    user,
	}
	json.NewEncoder(w).Encode(response)
}

func User(w http.ResponseWriter, r *http.Request) {
	tokenString, err := r.Cookie("jwt")
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString.Value, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		http.Error(w, "Unauthenticated", http.StatusUnauthorized)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		http.Error(w, "Server Error", http.StatusInternalServerError)
		return
	}

	var user models.User
	if err := database.DB.Where("username = ?", claims["username"]).First(&user).Error; err != nil {
		http.Error(w, "User Not Authenticated", http.StatusNotFound)
		return
	}

	response := map[string]interface{}{
		"data":    user,
		"message": "success",
	}
	json.NewEncoder(w).Encode(response)
}

func Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HttpOnly: true,
	})

	response := map[string]interface{}{
		"message": "success",
	}
	json.NewEncoder(w).Encode(response)
}
