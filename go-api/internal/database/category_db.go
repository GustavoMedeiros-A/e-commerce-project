package database

import (
	"database/sql"

	"github.com/GustavoMedeiros-A/e-commerce-project/internal/entity"
)

type CategoryDB struct {
	db *sql.DB
}

func NewCategoryDB(db *sql.DB) *CategoryDB {
	return &CategoryDB{db: db}
}

func (categoryDb *CategoryDB) GetCategories() ([]*entity.Category, error) {
	rows, err := categoryDb.db.Query("select id, name from categories")

	if err != nil {
		return nil, err
	}
	// Defer -> o comando é executado é sempre no final quando tem o DEFER
	defer rows.Close()

	var categories []*entity.Category

	for rows.Next() {
		var category entity.Category
		if err := rows.Scan(&category.ID, &category.Name); err != nil {
			return nil, err
		}
		categories = append(categories, &category)
	}

	return categories, nil

}

func (categoryDb *CategoryDB) GetCategory(id string) (*entity.Category, error) {
	var category entity.Category

	err := categoryDb.db.QueryRow("SELECT id, name FROM categories WHERE id =?", id).Scan(&category.ID, &category.Name)

	if err != nil {
		return nil, err
	}

	return &category, nil
}

func (categoryDb *CategoryDB) CreateCategory(category *entity.Category) (string, error) {

	_, err := categoryDb.db.Exec("INSERT INTO categories (id, name) VALUES (? , ?)", category.ID, category.Name)

	if err != nil {
		return "", err
	}

	return category.ID, nil
}
