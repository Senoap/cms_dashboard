// import { useState } from 'react';

// function PrintConfigModal({ isOpen, onClose, onPrint }) {
//   const [config, setConfig] = useState({
//     namaToko: "Pinarak Langgeng",
//     catatan: "Terima kasih atas kepercayaan Anda."
//   });

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay-custom">
//       <div className="modal-content-premium">
//         <h3>✏️ Edit Template Surat Jalan</h3>
//         <div className="modal-body-premium">
//           <label>Nama Toko/Header:</label>
//           <input 
//             value={config.namaToko} 
//             onChange={(e) => setConfig({...config, namaToko: e.target.value})} 
//             className="form-input-premium" 
//           />
//           <label style={{marginTop:'10px', display:'block'}}>Catatan:</label>
//           <textarea 
//             value={config.catatan} 
//             onChange={(e) => setConfig({...config, catatan: e.target.value})} 
//             className="form-input-premium" 
//           />
//         </div>
//         <div className="modal-actions">
//           <button onClick={() => onPrint(config)} className="btn-save">🖨️ Cetak Surat</button>
//           <button onClick={onClose} className="btn-close">Batal</button>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default PrintConfigModal;