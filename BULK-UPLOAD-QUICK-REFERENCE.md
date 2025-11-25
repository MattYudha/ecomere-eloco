# 📊 Bulk Upload - Quick Reference Guide

## 🎯 Fitur yang Sudah Tersedia

### ✅ Upload CSV

- **UI**: Drag & drop di http://localhost:3000/admin/bulk-upload
- **API**: `POST /api/bulk-upload`
- **Supports**: 5-1000+ products
- **Validation**: Real-time category checking
- **Format**: Download template tersedia

### ✅ View History

- **UI**: Upload History section
- **API**: `GET /api/bulk-upload`
- **Shows**: File name, statistics, errors, timestamp
- **Status**: COMPLETED / FAILED / PARTIAL

### ✅ Delete Batch

- **UI**: 🗑️ Trash icon di setiap batch
- **API**: `DELETE /api/bulk-upload/{batchId}`
- **Options**:
  - Delete batch only (keep products)
  - Delete batch + products
- **Protection**: Cannot delete if products in orders

---

## 🚀 Cara Menggunakan Delete Feature

### Dari UI (Recommended):

```
1. Buka: http://localhost:3000/admin/bulk-upload
2. Scroll ke "Upload History"
3. Klik tombol 🗑️ di batch yang ingin dihapus
4. Modal muncul dengan 2 pilihan:

   ┌─────────────────────────────────────────┐
   │ ⚠️ Delete Batch Upload                  │
   ├─────────────────────────────────────────┤
   │ Delete bulk-upload-example.csv?         │
   │                                         │
   │ ☐ Also delete all products from batch  │
   │   Warning: Permanent deletion!          │
   │                                         │
   │ [Cancel] [Delete Batch Only/& Products] │
   └─────────────────────────────────────────┘

5. Pilih:
   - ☐ UNCHECKED = Keep products, delete history only
   - ✅ CHECKED = Delete products + history

6. Klik button delete
7. ✅ Toast notification muncul
8. List auto-refresh
```

---

### Dari cURL/API:

#### Delete Batch Only (Keep Products):

```bash
curl -X DELETE "http://localhost:3001/api/bulk-upload/BATCH_ID?deleteProducts=false"
```

**Response**:

```json
{
  "message": "Batch deleted successfully (products kept)",
  "deletedProducts": false
}
```

#### Delete Batch + Products:

```bash
curl -X DELETE "http://localhost:3001/api/bulk-upload/BATCH_ID?deleteProducts=true"
```

**Response**:

```json
{
  "message": "Batch and products deleted successfully",
  "deletedProducts": true
}
```

**Error** (if products in orders):

```json
{
  "error": "Cannot delete products: Some products are in orders",
  "timestamp": "2025-10-12T..."
}
```

---

## 📋 Comparison Table

| Action                      | Batch Record | Items Record | Products       | Use Case                              |
| --------------------------- | ------------ | ------------ | -------------- | ------------------------------------- |
| **Delete Batch Only**       | ❌ Deleted   | ❌ Deleted   | ✅ **KEPT**    | Keep products for sale, clean history |
| **Delete Batch + Products** | ❌ Deleted   | ❌ Deleted   | ❌ **DELETED** | Wrong upload, test data, duplicates   |

---

## 🛡️ Protections

### Order Protection:

```
Product sudah di-order?
    ↓
DELETE request
    ↓
[Check orders] ←─ Database query
    ↓
If products in orders:
    ❌ Error 409
    "Cannot delete products: Some products are in orders"
Else:
    ✅ Delete allowed
```

### What Gets Deleted:

**Scenario 1: Delete Batch Only**

```
Before:
┌─────────────────┐  ┌──────────────┐  ┌──────────┐
│ bulk_upload_    │  │ bulk_upload_ │  │ Product  │
│ batch           │─→│ item         │─→│          │
│ (metadata)      │  │ (5 items)    │  │ (5 prod) │
└─────────────────┘  └──────────────┘  └──────────┘

After:
                                        ┌──────────┐
                                        │ Product  │
                                        │          │
                                        │ (5 prod) │
                                        └──────────┘
                                        ✅ Still available
```

**Scenario 2: Delete Batch + Products**

```
Before:
┌─────────────────┐  ┌──────────────┐  ┌──────────┐
│ bulk_upload_    │  │ bulk_upload_ │  │ Product  │
│ batch           │─→│ item         │─→│          │
│ (metadata)      │  │ (5 items)    │  │ (5 prod) │
└─────────────────┘  └──────────────┘  └──────────┘

After:
                     [All deleted]
                     ❌ Nothing left
```

---

## 🧪 Testing Steps

### Test Delete Batch Only:

```bash
# 1. Upload CSV
curl -X POST http://localhost:3001/api/bulk-upload \
  -F "file=@bulk-upload-example.csv"

# Response: { "batchId": "abc-123", ... }

# 2. Verify products created
curl http://localhost:3001/api/products | grep "Samsung Galaxy"
# ✅ Should find product

# 3. Delete batch (keep products)
curl -X DELETE "http://localhost:3001/api/bulk-upload/abc-123?deleteProducts=false"

# 4. Verify batch gone
curl http://localhost:3001/api/bulk-upload
# ❌ Batch abc-123 should be gone

# 5. Verify products still exist
curl http://localhost:3001/api/products | grep "Samsung Galaxy"
# ✅ Product still exists!
```

---

### Test Delete Batch + Products:

```bash
# 1. Upload CSV
curl -X POST http://localhost:3001/api/bulk-upload \
  -F "file=@bulk-upload-example.csv"

# Response: { "batchId": "xyz-789", ... }

# 2. Delete batch + products
curl -X DELETE "http://localhost:3001/api/bulk-upload/xyz-789?deleteProducts=true"

# 3. Verify products deleted
curl http://localhost:3001/api/products | grep "Samsung Galaxy"
# ❌ Product should NOT exist
```

---

### Test Order Protection:

```bash
# 1. Upload products
curl -X POST http://localhost:3001/api/bulk-upload \
  -F "file=@bulk-upload-example.csv"

# 2. Login as customer via frontend
# 3. Add product to cart
# 4. Checkout (create order)

# 5. Try to delete batch + products
curl -X DELETE "http://localhost:3001/api/bulk-upload/BATCH_ID?deleteProducts=true"

# Expected: 409 error
# {
#   "error": "Cannot delete products: Some products are in orders"
# }
```

---

## 💡 Best Practices

### ✅ DO:

1. **Review before delete**
   - Check how many products will be deleted
   - Check if batch status is FAILED/PARTIAL

2. **Use "Delete Batch Only" for audit trail**
   - Keep history for compliance
   - Products already in production

3. **Use "Delete Batch + Products" for cleanup**
   - Test uploads
   - Duplicate data
   - Invalid imports

4. **Check orders first**
   - Don't try to delete products that are ordered
   - System will block, but manual check is better

### ❌ DON'T:

1. **Don't delete production batches without backup**
2. **Don't force delete products in orders**
3. **Don't spam delete (rate limiter)**

---

## 🎯 Summary

**Hasil dari screenshot Anda sudah BENAR!** ✅

1. ✅ **Upload COMPLETED**: 5 products created successfully
2. ✅ **Upload FAILED**: Category errors shown clearly
3. ✅ **History displayed**: With statistics and errors
4. ✅ **Delete button available**: 🗑️ icon di setiap batch

**Cara Delete**:

- **Via UI**: Klik 🗑️ → Choose option → Confirm
- **Via API**: `DELETE /api/bulk-upload/{id}?deleteProducts=true/false`

**Protection**: Products in orders cannot be deleted ✅

---

## 📚 Related Documentation

- `BULK-UPLOAD-GUIDE.md` - Comprehensive guide
- `BULK-UPLOAD-EXPLANATION.md` - Full explanation
- `DELETE-BULK-UPLOAD-GUIDE.md` - Detailed delete guide

---

🎉 **Feature Complete!**
