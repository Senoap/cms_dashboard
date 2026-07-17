import { useManageInventory } from '../hooks/useManageInventory';
import InventoryForm from './InventoryForm';
import InventoryTable from './InventoryTable';
import '../css/ManageInventory.css';

function ManageInventory({ barangList, onRefreshBarang, activeTab, onEditBarang }) {
  const {
    formData, loading, currentPage, currentItems, totalPages,
    setCurrentPage, handleInputChange, handleSubmit, handleDeleteClick
  } = useManageInventory(barangList, onRefreshBarang);

  return (
    <>
      {activeTab === 'create-barang' && (
        <InventoryForm 
          formData={formData}
          loading={loading}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
        />
      )}

      {activeTab === 'list-barang' && (
        <InventoryTable 
          currentItems={currentItems}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onEditBarang={onEditBarang}
          handleDeleteClick={handleDeleteClick}
        />
      )}
    </>
  );
}

export default ManageInventory;