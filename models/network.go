package models

type Network struct {
	NetworkID        int    `gorm:"primaryKey;column:network_id" json:"id"`
	NetworkName      string `gorm:"size:100" json:"name"`
	NetworkAddress   string `gorm:"size:15" json:"network_address"`
	SubnetMask       string `gorm:"size:15" json:"subnet_mask"`
	BroadcastAddress string `gorm:"size:15" json:"broadcast_address"`
	Description      string `gorm:"type:text" json:"description"`
}
