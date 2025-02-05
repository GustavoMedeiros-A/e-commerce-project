package database

import (
	"database/sql"

	"github.com/GustavoMedeiros-A/e-commerce-project/internal/entity"
)

type ProductDB struct {
	db *sql.DB
}

func NewProductDB(db *sql.DB) *ProductDB {
	return &ProductDB{db: db}
}

// ID          string  `json:"id"`
// Name        string  `json:"name"`
// Description string  `json:"description"`
// Price       float64 `json:"price"`
// CategoryId  string
// ImageURL    string

func (productDb *ProductDB) GetProducts() ([]*entity.Product, error) {
	rows, err := productDb.db.Query("select id, name, description, price, category_id from products")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []*entity.Product

	for rows.Next() {
		var product entity.Product
		if err := rows.Scan(&product.ID, &product.Name, &product.Description, &product.Price, &product.CategoryId); err != nil {
			return nil, err
		}
		products = append(products, &product)
	}
	return products, nil

}

func (productDb *ProductDB) GetProduct(id string) (*entity.Product, error) {
	var product entity.Product

	err := productDb.db.QueryRow("SELECT * FROM products WHERE id =?", id).Scan(&product.ID, &product.Name, &product.Description, &product.Price, &product.CategoryId, &product.ImageURL)

	if err != nil {
		return nil, err
	}

	return &product, nil
}

func (productDb *ProductDB) GetProductByCategoryID(categoryId string) ([]*entity.Product, error) {
	rows, err := productDb.db.Query("SELECT * FROM products WHERE category_id =?", categoryId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []*entity.Product

	for rows.Next() {
		var product entity.Product
		if err := rows.Scan(&product.ID, &product.Name, &product.Description, &product.Price, &product.CategoryId, &product.ImageURL); err != nil {
			return nil, err
		}
		products = append(products, &product)
	}
	return products, nil
}

func (productDb *ProductDB) CreateProduct(product *entity.Product) (*entity.Product, error) {
	_, err := productDb.db.Exec("INSERT INTO products (id, name, description, price, category_id, image_url) VALUES (?,?,?,?,?,?)", product.ID, product.Name, product.Description, product.Price, product.CategoryId, product.ImageURL)

	if err != nil {
		return nil, err
	}

	return product, nil
}
