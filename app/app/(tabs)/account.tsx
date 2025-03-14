import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { logout } from '@/services/account';
import { Ionicons } from '@expo/vector-icons';
import { useCartContext } from '@/context/addCart';
import { socket } from '@/app/socket';

export default function AccountScreen() {
  const {isAuthenticated, setIsAuthenticated, user, setUser} = useAuth();
  const { cart, setCart } = useCartContext();
  const router = useRouter();

  //Socket
  useEffect(() => {
    if(isAuthenticated){
      socket.on("update-cart-qty", (cart) => {
        setCart(cart);
    });
    }
  }, []);


  const handleLogin = () => {
    router.push('/components/auth/login' as any);
  };

  const handleRegister = () => {
    router.push('/components/auth/signup' as any);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/components/auth/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <ScrollView style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.cartIcon} onPress={() => router.push("/components/cart/cart")}>
                <Ionicons name="cart-outline" size={28} color="#fff" />
                { cart ? (
                    <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cart}</Text>
                    </View>
                  ) : <></>
                }
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.authButtons}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="document-text-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Đơn Mua</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="wallet-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Ví Shopee</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="heart-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Đã thích</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Trung tâm trợ giúp</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <ScrollView style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerIcons}>
              <TouchableOpacity>
                <Ionicons name="settings-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.cartIcon} onPress={() => router.push("/components/cart/cart")}>
                <Ionicons name="cart-outline" size={28} color="#fff" />
                { cart ? (
                    <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cart}</Text>
                    </View>
                  ) : <></>
                }
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.userSection}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: user?.avatar || 'https://mms.img.susercontent.com/3a878081c51602cf627abc2a72154b81' }}
                style={styles.avatar}
              />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.username || 'User Name'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
            </View>
          </View>
        </View>

        {/* Order Status Section */}
        <View style={styles.orderStatusSection}>
          <Text style={styles.orderStatusTitle}>Đơn mua</Text>
          <View style={styles.orderStatusGrid}>
            <TouchableOpacity style={styles.orderStatusItem}>
              <Ionicons name="wallet-outline" size={24} color="#666" />
              <Text style={styles.orderStatusText}>Chò xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orderStatusItem}>
              <Ionicons name="cube-outline" size={24} color="#666" />
              <Text style={styles.orderStatusText}>Chờ lấy hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orderStatusItem}>
              <Ionicons name="car-outline" size={24} color="#666" />
              <Text style={styles.orderStatusText}>Chờ giao hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orderStatusItem}>
              <Ionicons name="star-outline" size={24} color="#666" />
              <Text style={styles.orderStatusText}>Đánh giá</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/components/cart/order")}>
            <Ionicons name="bag-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Đơn mua</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="wallet-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Ví ShopeePay</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="heart-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Đã thích</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#666" />
            <Text style={styles.menuText}>Trung tâm trợ giúp</Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ff4500',
    padding: 20,
    paddingTop: 40,
  },
  headerTop: {
    marginBottom: 20,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cartIcon: {
    marginLeft: 15,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#fff',
    fontSize: 14,
  },
  orderStatusSection: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
  },
  orderStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  orderStatusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderStatusItem: {
    alignItems: 'center',
    flex: 1,
  },
  orderStatusText: {
    fontSize: 12,
    marginTop: 8,
    color: '#666',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff4500',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  authButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#ee4d2d',
    fontSize: 14,
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#ee4d2d',
    fontSize: 14,
    fontWeight: '500',
  },
  messageIcon: {
    marginLeft: 15,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'red',
    fontSize: 12,
    fontWeight: "bold"
  },
});
