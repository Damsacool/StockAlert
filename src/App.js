import React, { useState } from 'react';
import { Package, LogOut } from 'lucide-react';
import { useProducts } from './hooks/useProducts';
import LoadingScreen from './components/Common/LoadingScreen'
import CompactProductCard from './components/ProductFeatures/CompactProductCard';
import AddProductModal from './components/Modals/AddProductModal';
import BulkEditModal from './components/Modals/BulkEditModal';
import ImageEditorModal from './components/Modals/ImageEditorModal';
import BulkImportModal from './components/Modals/BulkImportModal';
import './styles/App.css';
import AnalyticsSummary from './components/Layout/AnalyticsSummary'; 
import SearchBar from './components/Common/SearchBar';
import FilterButtons from './components/Common/FilterButtons';
import {exportToExcel, exportSummaryReport} from './utils/exportToExcel'
import SalesDashboard from './components/Layout/SalesDashboard';
import TransactionHistory from './components/Layout/TransactionHistory'
import SalesChart from './components/Layout/SalesChart';
import PrintReports from './components/Layout/PrintReports';
import InstallPrompt from './components/Common/InstallPrompt';
import OfflineIndicator from './components/Common/OfflineIndicator';
import { useNotifications } from './hooks/useNotifications';
import { processSyncQueue, restoreFromSupabase } from './utils/db';
import { useAuth } from './contexts/AuthContext';
import LoginScreen from './components/Auth/LoginScreen';
import AddWorkerModal from './components/Auth/AddWorkerModal';
import HamburgerMenu from './components/Common/HamburgerMenu';      
import BottomNav from './components/Common/BottomNav';
import { useTheme } from './hooks/useTheme';
import './themes.css';


function App() {
  const { user, profile, loading, signOut } = useAuth();
  console.log('Profile:', profile);

  const { products, isLoading, addNewProduct, updateStock, updateImages, removeProduct } = useProducts();

  const { permission, requestPermission, sendLowStockAlert } = useNotifications();

  const { theme, toggleTheme } = useTheme();

// Daily 6 PM low stock reminder
React.useEffect(() => {
  const scheduleDailyReminder = () => {
    const lowStockProducts = products.filter(p => p.stock <= p.minStock);
    
    if (lowStockProducts.length === 0) {
      // No low stock products, clear any existing reminders
      localStorage.removeItem('nextReminderTime');
      return;
    }

    // Request permission if not already granted
    if (permission === 'default') {
      requestPermission();
    }

    if (permission !== 'granted') {
      return; 
    }

    const now = new Date();
    
    // Calculate next 6 PM
    const next6PM = new Date();
    next6PM.setHours(18, 0, 0, 0);
    
    // If it's past 6 PM today, schedule for tomorrow
    if (now > next6PM) {
      next6PM.setDate(next6PM.getDate() + 1);
    }
    
    const timeUntil6PM = next6PM - now;
    
    console.log(`Next low stock reminder scheduled for: ${next6PM.toLocaleString()}`);
    console.log(`Time until reminder: ${Math.round(timeUntil6PM / 1000 / 60)} minutes`);
    
    // Store next reminder time
    localStorage.setItem('nextReminderTime', next6PM.toISOString());
    
    // Schedule the reminder
    const timerId = setTimeout(() => {
      console.log('Sending scheduled low stock reminder...');
      sendLowStockAlert(lowStockProducts);
      localStorage.setItem('lastLowStockReminder', new Date().toDateString());
      
      // Reschedule for next day
      setTimeout(() => scheduleDailyReminder(), 1000);
    }, timeUntil6PM);
    
    // Cleanup function
    return () => {
      clearTimeout(timerId);
    };
  };

  // Start the scheduler
  const cleanup = scheduleDailyReminder();
  
  return cleanup;
}, [products, permission, requestPermission, sendLowStockAlert]);

// Check on app startup if we missed a reminder
React.useEffect(() => {
  const checkMissedReminder = () => {
    const nextReminderTime = localStorage.getItem('nextReminderTime');
    const lastReminder = localStorage.getItem('lastLowStockReminder');
    const now = new Date();
    
    if (nextReminderTime) {
      const scheduled = new Date(nextReminderTime);
      
      // If scheduled time has passed and we haven't sent today
      if (now > scheduled && lastReminder !== now.toDateString()) {
        const lowStockProducts = products.filter(p => p.stock <= p.minStock);
        
        if (lowStockProducts.length > 0 && permission === 'granted') {
          console.log('Sending missed reminder...');
          sendLowStockAlert(lowStockProducts);
          localStorage.setItem('lastLowStockReminder', now.toDateString());
        }
      }
    }
  };

  if (products.length > 0) {
    checkMissedReminder();
  }
}, [products, permission, sendLowStockAlert]);

  // Auto-sync queue when back online
  React.useEffect(() => {
    const handleOnline = async () => {
      console.log('Back online! Processing sync queue...');
      const result = await processSyncQueue();
      
      if (result.success && result.synced > 0) {
        console.log(`Synced ${result.synced} offline changes!`);
      }
    };

    window.addEventListener('online', handleOnline);

    // Also process queue on app load (in case user closed app while offline)
    if (navigator.onLine) {
      processSyncQueue();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bulkAmount, setBulkAmount] = useState('');
  const [bulkType, setBulkType] = useState('');
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [activeTab, setActiveTab] = useState('inventory');
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    stock: '',
    minStock: '',
    costPrice: '',
    sellingPrice: '',
    images: ['', '', '', '']
  });

  const handleStockChange = (productId, action) => {
    if (action === 'bulk-decrease' || action === 'bulk-increase') {
      setSelectedProduct(products.find(p => p.id === productId));
      setBulkType(action === 'bulk-increase' ? 'increase' : 'decrease');
      setShowBulkModal(true);
    } else {
      updateStock(productId, action);
    }
  };

  const handleBulkSubmit = () => {
    const amount = parseInt(bulkAmount);
    if (!amount || amount <= 0) {
      alert('Entrez un nombre valide');
      return;
    }

    const newStock = bulkType === 'increase' 
      ? selectedProduct.stock + amount 
      : Math.max(0, selectedProduct.stock - amount);

    updateStock(selectedProduct.id, newStock);
    setShowBulkModal(false);
    setBulkAmount('');
  };

  const handleAddProduct = async () => {
    if (isAddingProduct) return; 

    if (!formData.name.trim()) {
      alert('Entrez le nom du produit');
      return;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      alert('Entrez le stock initial');
      return;
    }
    if (!formData.minStock || parseInt(formData.minStock) < 0) {
      alert('Entrez le stock minimum');
      return;
    }

    if (!formData.costPrice || parseInt(formData.costPrice) < 0) {
      alert('Entrez le prix d\'achat');
      return;
    }

    if (!formData.sellingPrice || parseInt(formData.sellingPrice) < 0) {
      alert('Entrez le prix de vente');
      return;
    }
    if (parseInt(formData.sellingPrice) <= parseInt(formData.costPrice)) {
      alert('Le prix de vente doit être supérieur au prix d\'achat!');
      return
    }

    const validImages = formData.images.filter(img => img && img.trim() !== '');

    setIsAddingProduct(true);

    try {
      const productData = {
        name: formData.name.trim(),
        stock: parseInt(formData.stock, 10),
        minStock: parseInt(formData.minStock, 10),
        costPrice: parseInt(formData.costPrice, 10),
        sellingPrice: parseInt(formData.sellingPrice, 10),
        images: validImages
      };

      await addNewProduct(productData);

      setFormData({
        name: '',
        stock: '',
        minStock: '',
        costPrice: '',
        sellingPrice: '',
        images: ['', '', '', '']
      });
      
    setShowAddModal(false);
    alert('✓ Produit ajouté avec succès!');
  } catch (err) {
    console.error('Error in handleAddProduct:', err);
    alert('Erreur: Impossible d\'ajouter le produit');
  } finally {
    setIsAddingProduct(false); // To re-enable the button after operation completes
  }
};

const handleBulkImport = async (products) => {
  try {
    let successCount = 0;
    let failCount = 0;

    for (const productData of products) {
      try {
        await addNewProduct(productData);
        successCount++;
      } catch (err) {
        console.error('Failed to import product:', productData.name, err);
        failCount++;
      }
    }

    if (failCount > 0) {
      alert(`Import terminé: ${successCount} réussis, ${failCount} échecs`);
    }
  } catch (err) {
    console.error('Bulk import error:', err);
    alert('Erreur lors de l\'import en masse');
  }
};

  const handleImageUpload = (index, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImages = [...formData.images];
      newImages[index] = reader.result;
      setFormData({ ...formData, images: newImages });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Supprimer ce produit définitivement?')) {
      await removeProduct(productId);
    }
  };

  const handleEditImages = (product) => {
    setSelectedProduct(product);
    setShowImageModal(true);
  };

  if (loading || isLoading) {
    return <LoadingScreen />;
  }

  // Export handlers
  const handleExport = () => {
    try {
      const filename = exportToExcel(products);
      alert(`✓ Exporté: ${filename}`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'export');
    }
  };

  const handleExportSummary = () => {
    try {
      const filename = exportSummaryReport(products);
      alert(`✓ Rapport exporté: ${filename}`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'export du rapport');
    }
  };

  //Filter and search logic
  const filteredProducts = products.filter(product => {
    //Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

    //Stock filter
    let matchesFilter = true;
    if (filterType === 'low-stock') {
      matchesFilter = product.stock <= product.minStock;
    } else if (filterType === 'normal') {
      matchesFilter = product.stock > product.minStock;
    }

    return matchesSearch && matchesFilter;
  })

  // Sort logic
  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'stock-low':
        return a.stock - b.stock;
      case 'stock-high':
        return b.stock - a.stock;
      case 'date-new':
        return b.id - a.id;
      case 'date-old':
        return a.id - b.id;
      default:
        return 0;
    }
  });

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className='app'>
      <OfflineIndicator />
      <InstallPrompt />
      
      <header className="app-header">
        <div className="header-content">

          {/* Hamburger Menu */}
          <HamburgerMenu
            activeTab={activeTab}
            onTabChange={setActiveTab}
            userRole={profile?.role}
            onAddWorker={() => setShowAddWorkerModal(true)}
            onBulkImport={() => setShowBulkImportModal(true)}
            onRestore={async () => {
              if (window.confirm('Restaurer depuis le cloud? Cela remplacera les données locales.')) {
                try {
                  const result = await restoreFromSupabase();
        
                  if (result.success) {
                    alert(`✓ ${result.productsCount} produits restaurés!`);
                    window.location.reload();
                  } else {
                    alert('Erreur: ' + result.error);
                  }
                } catch (err) {
                  console.error('Restore error:', err);
                  alert('Erreur lors de la restauration');
                }
              }
            }}

            onLogout={async () => {
              if (window.confirm('Se déconnecter?')) {
                await signOut();
                window.location.reload();
            }
            }}
              theme={theme}
              onThemeToggle={toggleTheme}
          />

          {/* App Title */}
          <div className="header-title">
            <Package size={28} />
            <div>
              <h1>StockAlert</h1>
              <p>Inventaire</p>
            </div>
          </div>

          {/* Right Side: Badge + Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="user-badge">
              <span className="user-role">{profile?.role === 'owner' ? 'Propriétaire' : 'Travailleur'}</span>
            </div>
            
            <button
              onClick={async () => {
                if (window.confirm('Se déconnecter?')) {
                  await signOut();
                  window.location.reload();
                }
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--danger-light)',
                color: 'var(--danger)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              <LogOut size={16} />
              <span style={{ display: 'none' }}>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className='container'>
        {/* TAB 1: INVENTAIRE */}
        {activeTab === 'inventory' && (
          <>
            {products.length > 0 && <AnalyticsSummary products={products} />}

            {products.length > 0 && (
              <>
                <SearchBar 
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onClear={() => setSearchQuery('')}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
                
                <FilterButtons
                  activeFilter={filterType}
                  onChange={setFilterType}
                  counts={{
                    all: products.length,
                    lowStock: products.filter(p => p.stock <= p.minStock).length,
                    normal: products.filter(p => p.stock > p.minStock).length
                  }}
                />
              </>
            )}

            <div className='product-grid'>
              {filteredProducts.length === 0 ? (
                <div className='empty-state'>
                  <Package size={64} strokeWidth={1} />
                  <p>Aucun produit trouvé</p>
                  <p className='empty-subtitle'>
                    {searchQuery ? 'Essayez un autre terme de recherche' : 'Ajoutez votre premier produit'}
                  </p>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <CompactProductCard
                    key={product.id}
                    product={product}
                    onStockChange={handleStockChange}
                    onEdit={handleEditImages}
                    onDelete={handleDeleteProduct}
                    userRole={profile?.role}
                  />
                ))
              )}
            </div>
          </>
        )}

        {/* TAB 2: VENTES */}
        {activeTab === 'sales' && (
          <>
            {products.length > 0 ? (
              <>
                <SalesDashboard products={products} />
                <SalesChart products={products} />
              </>
            ) : (
              <div className='empty-state'>
                <Package size={64} strokeWidth={1} />
                <p>Aucun produit</p>
                <p className='empty-subtitle'>Ajoutez des produits dans l'onglet Inventaire</p>
              </div>
            )}
          </>
        )}

        {/* TAB 3: HISTORIQUE */}
        {activeTab === 'history' && (
          <>
            {products.length > 0 ? (
              <TransactionHistory products={products} />
            ) : (
              <div className='empty-state'>
                <Package size={64} strokeWidth={1} />
                <p>Aucun produit</p>
                <p className='empty-subtitle'>Ajoutez des produits dans l'onglet Inventaire</p>
              </div>
            )}
          </>
        )}

        {/* TAB 4: RAPPORTS */}
        {activeTab === 'reports' && (
          <>
            {profile?.role === 'owner' ? (
              products.length > 0 ? (
                <PrintReports
                  products={products}
                  onExport={handleExport}
                  onExportSummary={handleExportSummary}
                />
              ) : (
                <div className='empty-state'>
                  <Package size={64} strokeWidth={1} />
                  <p>Aucun produit</p>
                  <p className='empty-subtitle'>Ajoutez des produits dans l'onglet Inventaire</p>
                </div>
              )
            ) : (
              <div className='empty-state'>
                <Package size={64} strokeWidth={1} />
                <p>Accès restreint</p>
                <p className='empty-subtitle'>Les rapports sont réservés au propriétaire</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODALS */}
      <AddProductModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddProduct}
        onImageUpload={handleImageUpload}
        isSubmitting={isAddingProduct}
      />

      <BulkEditModal
        show={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        product={selectedProduct}
        bulkType={bulkType}
        bulkAmount={bulkAmount}
        setBulkAmount={setBulkAmount}
        onSubmit={handleBulkSubmit}
      />

      <ImageEditorModal
        show={showImageModal}
        onClose={() => setShowImageModal(false)}
        product={selectedProduct}
        setProduct={setSelectedProduct}
        updateImages={updateImages}
      />

      <AddWorkerModal
        show={showAddWorkerModal}
        onClose={() => setShowAddWorkerModal(false)}
        onWorkerAdded={() => {
          alert('Travailleur ajouté avec succès!');
          setShowAddWorkerModal(false);
        }}
      />

      <BulkImportModal
        show={showBulkImportModal}
        onClose={() => setShowBulkImportModal(false)}
        onImport={handleBulkImport}
      />

      {/* BOTTOM NAVIGATION */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddProduct={() => setShowAddModal(true)}
        userRole={profile?.role}
      />
    </div>
  );
}

export default App;