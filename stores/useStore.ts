import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

// Define the Product and Category interfaces
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface Category {
  id: number;
  name: string;
  productCount: number;
}

export const useStore = defineStore('main', {
  state: () => ({
    products: useStorage<Product[]>('products', []),
    categories: useStorage<Category[]>('categories', []),
  }),
  actions: {
    async fetchProducts() {
      if (this.products.length === 0) {
        this.products = await $fetch<Product[]>(
          'https://fakestoreapi.com/products'
        );
      }
    },
    async fetchCategories() {
      if (this.categories.length === 0) {
        const fetchedCategories = await $fetch<string[]>(
          'https://fakestoreapi.com/products/categories'
        );
        const categoryCounts = await this.fetchProductCounts();
        this.categories = fetchedCategories.map((category, index) => ({
          id: index,
          name: category,
          productCount: categoryCounts[category] || 0,
        }));
      }
    },
    async fetchProductCounts() {
      const products = await $fetch<{ category: string }[]>(
        'https://fakestoreapi.com/products'
      );
      const categoryCounts = products.reduce(
        (acc, product) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );
      return categoryCounts;
    },
    addProduct(product: Product) {
      this.products.push(product);
    },
    editProduct(product: Product) {
      const index = this.products.findIndex((p) => p.id === product.id);
      if (index !== -1) this.products[index] = product;
    },
    deleteProduct(id: number) {
      this.products = this.products.filter((product) => product.id !== id);
    },
    addCategory(category: Category) {
      this.categories.push(category);
    },
    editCategory(category: Category) {
      const index = this.categories.findIndex((c) => c.id === category.id);
      if (index !== -1) this.categories[index] = category;
    },
    deleteCategory(id: number) {
      const categoryToDelete = this.categories.find(
        (category) => category.id === id
      );
      if (categoryToDelete) {
        this.categories = this.categories.filter(
          (category) => category.id !== id
        );
        this.products = this.products.filter(
          (product) => product.category !== categoryToDelete.name
        );
      }
    },
  },
});
// stores/useProfileStore.ts

export const useProfileStore = defineStore('profile', {
  state: () => ({
    name: useStorage('profileName', ''),
    email: useStorage('profileEmail', ''),
  }),
  actions: {
    updateProfile(name: string, email: string) {
      this.name = name;
      this.email = email;
    },
    logout() {
      this.name = '';
      this.email = '';
    },
  },
  persist: true,
});
