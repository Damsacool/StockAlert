import React, { useState } from 'react';
import { Upload, X, Download, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

const BulkImportModal = ({ show, onClose, onImport }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!show) return null;

  const downloadTemplate = () => {
    // Create sample data
    const template = [
      {
        'Nom Produit': 'Filtre à huile Toyota',
        'Stock Initial': 15,
        'Stock Minimum': 5,
        'Prix Achat (CFA)': 3500,
        'Prix Vente (CFA)': 5000,
        'Catégorie': 'Filtres',
        'Code/SKU': 'TOY-FO-001'
      },
      {
        'Nom Produit': 'Bougie NGK',
        'Stock Initial': 30,
        'Stock Minimum': 10,
        'Prix Achat (CFA)': 2000,
        'Prix Vente (CFA)': 3500,
        'Catégorie': 'Bougies',
        'Code/SKU': 'NGK-SP-002'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Produits');
    
    // Auto-size columns
    const maxWidth = 25;
    ws['!cols'] = [
      { wch: maxWidth },
      { wch: 15 },
      { wch: 15 },
      { wch: 18 },
      { wch: 18 },
      { wch: 15 },
      { wch: 15 }
    ];

    XLSX.writeFile(wb, 'StockAlert_Template.xlsx');
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setError('');
    setFile(selectedFile);

    // Read and preview file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        if (jsonData.length === 0) {
          setError('Le fichier est vide');
          return;
        }

        // Validate required columns
        const requiredColumns = [
          'Nom Produit',
          'Stock Initial',
          'Stock Minimum',
          'Prix Achat (CFA)',
          'Prix Vente (CFA)'
        ];

        const firstRow = jsonData[0];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));

        if (missingColumns.length > 0) {
          setError(`Colonnes manquantes: ${missingColumns.join(', ')}`);
          return;
        }

        // Preview first 5 rows
        setPreview(jsonData.slice(0, 5));
      } catch (err) {
        console.error('File read error:', err);
        setError('Erreur lors de la lecture du fichier');
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);

          // Transform data to match current product format
          const products = jsonData.map((row, index) => ({
            name: row['Nom Produit'] || `Produit ${index + 1}`,
            stock: parseInt(row['Stock Initial']) || 0,
            minStock: parseInt(row['Stock Minimum']) || 0,
            costPrice: parseInt(row['Prix Achat (CFA)']) || 0,
            sellingPrice: parseInt(row['Prix Vente (CFA)']) || 0,
            category: row['Catégorie'] || '',
            sku: row['Code/SKU'] || '',
            images: []
          }));

          // Validate products
          const invalid = products.filter(p => 
            !p.name || 
            p.stock < 0 || 
            p.minStock < 0 || 
            p.costPrice < 0 || 
            p.sellingPrice < 0 ||
            p.sellingPrice <= p.costPrice
          );

          if (invalid.length > 0) {
            setError(`${invalid.length} produit(s) invalide(s). Vérifiez que le prix de vente > prix d'achat.`);
            setIsProcessing(false);
            return;
          }

          // Import products
          await onImport(products);
          
          // Success
          alert(`✓ ${products.length} produits importés avec succès!`);
          setFile(null);
          setPreview([]);
          onClose();
        } catch (err) {
          console.error('Import error:', err);
          setError('Erreur lors de l\'importation');
        } finally {
          setIsProcessing(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error('Import error:', err);
      setError('Erreur lors de l\'importation');
      setIsProcessing(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Import en masse
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '8px'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Instructions */}
        <div style={{
          background: 'var(--primary-light)',
          border: '1px solid var(--primary)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text-primary)', fontWeight: '600' }}>
            Instructions:
          </p>
          <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <li>Téléchargez le modèle Excel</li>
            <li>Remplissez vos produits (nom, stock, prix, etc.)</li>
            <li>Importez le fichier complété</li>
          </ol>
        </div>

        {/* Download Template Button */}
        <button
          onClick={downloadTemplate}
          style={{
            width: '100%',
            padding: '14px',
            border: '2px dashed var(--border)',
            borderRadius: '10px',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '24px',
            transition: 'all 0.2s'
          }}
        >
          <Download size={20} />
          Télécharger le modèle Excel
        </button>

        {/* File Upload */}
        <label style={{
          display: 'block',
          width: '100%',
          padding: '40px 20px',
          border: '2px dashed var(--border)',
          borderRadius: '10px',
          background: 'var(--bg-secondary)',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'all 0.2s',
          marginBottom: '16px'
        }}>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <Upload size={48} style={{ color: 'var(--text-tertiary)', margin: '0 auto 12px' }} />
          <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)', fontWeight: '600' }}>
            {file ? file.name : 'Cliquez pour sélectionner un fichier'}
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Formats acceptés: .xlsx, .xls, .csv
          </p>
        </label>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'var(--danger-light)',
            border: '1px solid var(--danger)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start'
          }}>
            <AlertCircle size={20} style={{ color: 'var(--danger)', flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--danger)' }}>{error}</p>
          </div>
        )}

        {/* Preview */}
        {preview.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
              Aperçu ({preview.length} premiers produits):
            </p>
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '12px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {preview.map((product, index) => (
                <div key={index} style={{
                  padding: '8px',
                  borderBottom: index < preview.length - 1 ? '1px solid var(--border)' : 'none'
                }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {product['Nom Produit']}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Stock: {product['Stock Initial']} | Prix: {product['Prix Vente (CFA)']} CFA
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Import Button */}
        <button
          onClick={handleImport}
          disabled={!file || isProcessing}
          style={{
            width: '100%',
            padding: '14px',
            border: 'none',
            borderRadius: '10px',
            background: !file || isProcessing ? 'var(--text-tertiary)' : 'var(--primary)',
            color: 'white',
            fontSize: '15px',
            fontWeight: '700',
            cursor: !file || isProcessing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          {isProcessing ? (
            <>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid white',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              Importation...
            </>
          ) : (
            <>
              <Upload size={20} />
              Importer les produits
            </>
          )}
        </button>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default BulkImportModal;