package storage

import (
	"encoding/json"
	"fmt"
	"knitinfo-backend/pkg/models"
	"knitinfo-backend/pkg/repository"
	"os"
	"sync"
	"time"

	"github.com/jmoiron/sqlx"
)

type HybridStorage struct {
	db              *sqlx.DB
	useDatabase     bool
	storageFile     string
