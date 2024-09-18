package wol

import (
	"bytes"
	"encoding/hex"
	"errors"
	"net"
	"strconv"
	"strings"
)

func WakeOnLan(macAddress string, ipAddress string, networkAddress string, port uint32) error {
	macAddress = strings.ReplaceAll(macAddress, ":", "")
	macAddress = strings.ReplaceAll(macAddress, "-", "")

	if len(macAddress) != 12 {
		return errors.New("invalid MAC address")
	}

	if net.ParseIP(ipAddress) == nil {
		return errors.New("invalid Ip address")
	}

	macBytes, err := hex.DecodeString(macAddress)
	if err != nil {
		return err
	}

	magicPacket := bytes.Repeat([]byte{0xFF}, 6)
	for i := 0; i < 16; i++ {
		magicPacket = append(magicPacket, macBytes...)
	}

	addr, err := net.ResolveUDPAddr("udp", networkAddress+":"+strconv.FormatInt(int64(port), 10))
	if err != nil {
		return err
	}
	conn, err := net.DialUDP("udp", nil, addr)
	if err != nil {
		return err
	}
	defer conn.Close()

	_, err = conn.Write(magicPacket)
	return err
}
