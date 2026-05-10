import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';

// Helper to compress image to Base64 so it fits in Firestore
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG with 0.7 quality to keep it under 1MB
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const api = {
  loginAdmin: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { token: userCredential.user.accessToken };
    } catch (error) {
      throw new Error('Login failed: ' + error.message);
    }
  },

  getProducts: async () => {
    try {
      const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      return products;
    } catch (error) {
      console.error("Error fetching products", error);
      return []; 
    }
  },

  addProduct: async (productData, imageFile) => {
    let imageUrl = '';
    
    // Compress and convert image to Base64 string directly
    if (imageFile) {
      imageUrl = await compressImage(imageFile);
    }

    // Add document to Firestore (saving the image string inside the database)
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      title: productData.title,
      description: productData.description,
      price: parseFloat(productData.price),
      imageUrl: imageUrl,
      createdAt: serverTimestamp()
    });

    return { id: docRef.id };
  },

  deleteProduct: async (id) => {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
    return { success: true };
  },

  placeOrder: async (orderData) => {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...orderData,
      status: 'New',
      createdAt: serverTimestamp()
    });
    return { id: docRef.id };
  },

  getOrders: async () => {
    try {
      const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const orders = [];
      querySnapshot.forEach((d) => {
        orders.push({ id: d.id, ...d.data() });
      });
      return orders;
    } catch (error) {
      console.error("Error fetching orders", error);
      return [];
    }
  },

  updateOrderStatus: async (id, status) => {
    const { updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, ORDERS_COLLECTION, id), { status });
    return { success: true };
  }
};
