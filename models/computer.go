package models

type Computer struct {
	Id        uint    `json:"id" gorm:"primaryKey;autoIncrement:true"`
	UserId    uint    `json:"user_id" gorm:"foreignKey:CompanyRefer"`
	Name      string  `json:"name" gorm:"not null"`
	Mac       string  `json:"mac" gorm:"not null"`
	Ip        string  `json:"ip" gorm:"not null"`
	Port      uint32  `json:"port" gorm:"not null"`
	NetworkID int     `gorm:"column:network_id" json:"network_id"`
	Status    string  `json:"status" gorm:"default:'unknown"`
	Network   Network `gorm:"foreignKey:NetworkID;references:NetworkID" json:"network"` // Preload relation
}
