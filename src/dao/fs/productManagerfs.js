import fs from 'fs/promises';
import path from 'path';

class ProductManagerFs {
  constructor(path) {
    this.path = path;
  }

  async #save(object) {
    try {
      const objectToStr = JSON.stringify(object, null, 2);
      await fs.writeFile(this.path, objectToStr);
    } catch (ErrorSave) {
      console.error({ ErrorSave });
    }
  }

  async getProducts() {
    try {
      let products = [];
      try {
        const readFile = await fs.readFile(this.path, 'utf-8');
        products = JSON.parse(readFile);
      } catch (error) {
        console.log('File not exist. Building...');
        await this.#save([]);
      }
      return products;
    } catch (error) {
      console.error({ error });
      return [];
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((product) => product?.id === id);
      if (product) return product;
      console.error('Producto no encontrado');
      return null;
    } catch (ErrorGetProductById) {
      console.error({ ErrorGetProductById });
    }
  }

  async addProduct({
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = [],
  }) {
    if (!title || !description || !code || !price || !stock || !category) {
      console.error('Faltan campos obligatorios');
      return null;
    }

    
    thumbnails.push('https://picsum.photos/536/354?image=');
    thumbnails.push('https://picsum.photos/536/354?image=');
    thumbnails.push('https://picsum.photos/536/354?image=');

    try {
      const products = await this.getProducts();
      const findCode = products.find((product) => product.code === code);
      if (findCode) {
        console.error('Codigo ya existente');
        return null;
      }

      let id = products.length ? products[products.length - 1].id + 1 : 1;
      const newProduct = {
        id,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      };
      products.push(newProduct);

      await this.#save(products);
      return newProduct;
    } catch (ErrorAddProduct) {
      console.error({ ErrorAddProduct });
    }
  }

  async updateProduct(id, object) {
    object = { ...object, id: id };
    try {
      let products = await this.getProducts();

      const index = products.findIndex((product) => product.id === id);
      if (index >= 0) {
        products[index] = { ...products[index], ...object };
        await this.#save(products);
        return products[index];
      }
      console.error('Producto no encontrado');
      return null;
    } catch (ErrorUpdateProduct) {
      console.error({ ErrorUpdateProduct });
    }
  }

  async deleteProduct(id) {
    try {
      let products = await this.getProducts();
      const index = products.findIndex((product) => product.id === id);
      if (index >= 0) {
        const deleted = products.splice(index, 1);
        await this.#save(products);
        return deleted;
      }
      console.error('Producto no encontrado');
      return null;
    } catch (ErrorDeleteProduct) {
      console.error({ ErrorDeleteProduct });
    }
  }
}

const rutaProducts = path.join(__dirname, '../../db/productos.json');
export default new ProductManagerFs(rutaProducts);
