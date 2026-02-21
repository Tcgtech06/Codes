package database

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

type SupabaseClient struct {
	BaseURL    string
	APIKey     string
	ServiceKey string
	HTTPClient *http.Client
}

func NewSupabaseRESTClient() (*SupabaseClient, error) {
	baseURL := os.Getenv("SUPABASE_URL")
	if baseURL == "" {
		return nil, fmt.Errorf("SUPABASE_URL not set")
	}

	apiKey := os.Getenv("SUPABASE_ANON_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("SUPABASE_ANON_KEY not set")
	}

	serviceKey := os.Getenv("SUPABASE_SERVICE_KEY")
	if serviceKey == "" {
		return nil, fmt.Errorf("SUPABASE_SERVICE_KEY not set")
	}

	return &SupabaseClient{
		BaseURL:    baseURL,
		APIKey:     apiKey,
		ServiceKey: serviceKey,
		HTTPClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}, nil
}

// Query executes a GET request to Supabase REST API
func (c *SupabaseClient) Query(table string, query map[string]string) ([]byte, error) {
	url := fmt.Sprintf("%s/rest/v1/%s", c.BaseURL, table)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	// Add query parameters
	q := req.URL.Query()
	for key, value := range query {
		q.Add(key, value)
	}
	req.URL.RawQuery = q.Encode()

	// Set headers
	req.Header.Set("apikey", c.ServiceKey)
	req.Header.Set("Authorization", "Bearer "+c.ServiceKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("supabase error: %s - %s", resp.Status, string(body))
	}

	return body, nil
}

// Insert executes a POST request to Supabase REST API
func (c *SupabaseClient) Insert(table string, data interface{}) ([]byte, error) {
	url := fmt.Sprintf("%s/rest/v1/%s", c.BaseURL, table)

	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	req.Header.Set("apikey", c.ServiceKey)
	req.Header.Set("Authorization", "Bearer "+c.ServiceKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "return=representation")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("supabase error: %s - %s", resp.Status, string(body))
	}

	return body, nil
}

// Update executes a PATCH request to Supabase REST API
func (c *SupabaseClient) Update(table string, filter map[string]string, data interface{}) ([]byte, error) {
	url := fmt.Sprintf("%s/rest/v1/%s", c.BaseURL, table)

	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("PATCH", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	// Add query parameters for filtering
	q := req.URL.Query()
	for key, value := range filter {
		q.Add(key, value)
	}
	req.URL.RawQuery = q.Encode()

	req.Header.Set("apikey", c.ServiceKey)
	req.Header.Set("Authorization", "Bearer "+c.ServiceKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Prefer", "return=representation")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("supabase error: %s - %s", resp.Status, string(body))
	}

	return body, nil
}

// Delete executes a DELETE request to Supabase REST API
func (c *SupabaseClient) Delete(table string, filter map[string]string) error {
	url := fmt.Sprintf("%s/rest/v1/%s", c.BaseURL, table)

	req, err := http.NewRequest("DELETE", url, nil)
	if err != nil {
		return err
	}

	// Add query parameters for filtering
	q := req.URL.Query()
	for key, value := range filter {
		q.Add(key, value)
	}
	req.URL.RawQuery = q.Encode()

	req.Header.Set("apikey", c.ServiceKey)
	req.Header.Set("Authorization", "Bearer "+c.ServiceKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("supabase error: %s - %s", resp.Status, string(body))
	}

	return nil
}

// Count returns the count of rows matching the filter
func (c *SupabaseClient) Count(table string, filter map[string]string) (int, error) {
	url := fmt.Sprintf("%s/rest/v1/%s", c.BaseURL, table)

	req, err := http.NewRequest("HEAD", url, nil)
	if err != nil {
		return 0, err
	}

	// Add query parameters
	q := req.URL.Query()
	for key, value := range filter {
		q.Add(key, value)
	}
	req.URL.RawQuery = q.Encode()

	req.Header.Set("apikey", c.ServiceKey)
	req.Header.Set("Authorization", "Bearer "+c.ServiceKey)
	req.Header.Set("Prefer", "count=exact")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return 0, fmt.Errorf("supabase error: %s", resp.Status)
	}

	// Parse Content-Range header for count
	contentRange := resp.Header.Get("Content-Range")
	var count int
	fmt.Sscanf(contentRange, "*/%d", &count)

	return count, nil
}
