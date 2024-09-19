package models

import (
	"time"
)

type WakeLog struct {
	Id         uint      `json:"id" gorm:"primaryKey;autoIncrement:true"`
	ComputerId uint      `json:"computer_id" gorm:"not null"`
	Computer   Computer  `gorm:"foreignKey:ComputerId;references:Id" json:"computer"`
	UserId     uint      `json:"user_id" gorm:"not null"`
	User       User      `gorm:"foreignKey:UserId;references:Id" json:"user"`
	Status     string    `json:"status" gorm:"not null;default:'pending'"`
	CreatedAt  time.Time `json:"created_at" gorm:"autoCreateTime"`
}
