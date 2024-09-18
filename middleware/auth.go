package middleware

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/golang-jwt/jwt"
)

// AuthClaims defines the structure for JWT claims
type AuthClaims struct {
	Username string `json:"username"`
	Id       string `json:"id"`
	jwt.StandardClaims
}

// IsAuthenticated is a middleware function that checks if the request is authenticated
func IsAuthenticated(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			http.Error(w, "Authorization header missing", http.StatusUnauthorized)
			return
		}

		// Remove "Bearer " prefix if present
		if strings.HasPrefix(tokenString, "Bearer ") {
			tokenString = strings.TrimPrefix(tokenString, "Bearer ")
		}

		claims := &AuthClaims{}
		tkn, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil {
			fmt.Println(err)
			if err == jwt.ErrSignatureInvalid {
				http.Error(w, "Session Expired", http.StatusUnauthorized)
				return
			}
			http.Error(w, "Invalid Token", http.StatusBadRequest)
			return
		}
		if !tkn.Valid {
			http.Error(w, "Session Expired", http.StatusUnauthorized)
			return
		}

		userId, err := strconv.ParseUint(fmt.Sprintf("%v", claims.Id), 10, 32)
		if err != nil {
			http.Error(w, "Server error", http.StatusInternalServerError)
			return
		}

		// Store claims in request context
		ctx := r.Context()
		ctx = context.WithValue(ctx, "claims", claims)
		ctx = context.WithValue(ctx, "username", claims.Username)
		ctx = context.WithValue(ctx, "id", uint(userId))
		ctx = context.WithValue(ctx, "uid", claims.Id)
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	})
}
