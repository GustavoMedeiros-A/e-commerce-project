package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/GustavoMedeiros-A/e-commerce-project/internal/database"
	"github.com/GustavoMedeiros-A/e-commerce-project/internal/service"
	"github.com/GustavoMedeiros-A/e-commerce-project/internal/webserver"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	db, err := sql.Open("mysql", "root:root@tcp(localhost:3306)/catalog")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	categoryDB := database.NewCategoryDB(db)
	categoryService := service.NewCategoryService(*categoryDB)

	productDB := database.NewProductDB(db)
	productService := service.NewProductService(*productDB)

	webCategoryHandlerServer := webserver.NewWebCategoryHandler(categoryService)
	webProductHandlerServer := webserver.NewWebProductHandler(productService)

	c := chi.NewRouter()
	c.Use(middleware.Logger)
	c.Use(middleware.Recoverer)

	c.Get("/category/{id}", webCategoryHandlerServer.GetCategory)
	c.Get("/categories", webCategoryHandlerServer.GetCategories)
	c.Post("/category", webCategoryHandlerServer.CreateCategory)

	c.Get("/product/{id}", webProductHandlerServer.GetProduct)
	c.Get("/products", webProductHandlerServer.GetProducts)
	c.Get("/products/category/{categoryID}", webProductHandlerServer.GetProductByCategoryID)
	c.Post("/product", webProductHandlerServer.CreateProduct)

	fmt.Println("Server is running on post 8081")
	http.ListenAndServe(":8081", c)

}
