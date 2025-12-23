import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory } from '../types';
import { Plus, Edit2, Trash2, Wand2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { generateProductDescription, generateProductImage } from '../services/geminiService';

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: ProductCategory.DRINKS,
    description: '',
    available: true,
    imageUrl: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      category: ProductCategory.DRINKS,
      description: '',
      available: true,
      imageUrl: ''
    });
    setEditingId(null);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData(product);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (editingId) {
      updateProduct({ ...formData, id: editingId } as Product);
    } else {
      addProduct({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
      } as Product);
    }
    resetForm();
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) {
      alert("Digite o nome do produto primeiro.");
      return;
    }
    setIsGeneratingDesc(true);
    const desc = await generateProductDescription(formData.name, formData.category || 'Geral');
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGeneratingDesc(false);
  };

  const handleGenerateImage = async () => {
    if (!formData.name) {
      alert("Digite o nome do produto primeiro.");
      return;
    }
    setIsGeneratingImg(true);
    const imageBase64 = await generateProductImage(formData.name);
    if (imageBase64) {
      setFormData(prev => ({ ...prev, imageUrl: imageBase64 }));
    } else {
      alert("Erro ao gerar imagem. Verifique a chave da API.");
    }
    setIsGeneratingImg(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
            {editingId ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input 
                type="text" 
                required
                className="w-full mt-1 p-2 border rounded focus:ring-brand-500 focus:border-brand-500"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  className="w-full mt-1 p-2 border rounded"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoria</label>
                <select 
                  className="w-full mt-1 p-2 border rounded"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as ProductCategory})}
                >
                  {Object.values(ProductCategory).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Imagem (URL)</label>
                <button 
                  type="button" 
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImg}
                  className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-pink-200"
                >
                  {isGeneratingImg ? <Loader2 size={12} className="animate-spin" /> : <ImageIcon size={12} />}
                  {isGeneratingImg ? 'Gerando...' : 'IA Gerar Imagem'}
                </button>
              </div>
              <input 
                type="text" 
                className="w-full mt-1 p-2 border rounded text-sm"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
              />
              {formData.imageUrl && (
                <div className="mt-2 h-32 w-full rounded-lg overflow-hidden border bg-gray-50">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <button 
                  type="button" 
                  onClick={handleGenerateDescription}
                  disabled={isGeneratingDesc}
                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1 hover:bg-purple-200"
                >
                  {isGeneratingDesc ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                  {isGeneratingDesc ? 'Gerando...' : 'IA Gerar Texto'}
                </button>
              </div>
              <textarea 
                className="w-full p-2 border rounded text-sm h-24"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="flex items-center gap-2">
               <input 
                 type="checkbox"
                 id="available"
                 checked={formData.available}
                 onChange={e => setFormData({...formData, available: e.target.checked})}
                 className="rounded text-brand-500 focus:ring-brand-500"
               />
               <label htmlFor="available" className="text-sm font-medium text-gray-700">Disponível para venda</label>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                type="submit" 
                className="flex-1 bg-brand-500 text-white py-2 rounded hover:bg-brand-600 font-semibold"
              >
                {editingId ? 'Salvar Alterações' : 'Criar Produto'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b font-bold text-gray-700">Cardápio Atual</div>
          <div className="overflow-y-auto max-h-[600px]">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-xs font-bold text-gray-500 uppercase">Produto</th>
                  <th className="p-3 text-xs font-bold text-gray-500 uppercase">Categ.</th>
                  <th className="p-3 text-xs font-bold text-gray-500 uppercase">Preço</th>
                  <th className="p-3 text-right text-xs font-bold text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-3 flex items-center gap-3">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} className="w-10 h-10 rounded object-cover border" alt="" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">IMG</div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{p.description}</div>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{p.category}</td>
                    <td className="p-3 font-mono text-sm">R$ {p.price.toFixed(2)}</td>
                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
                      <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;