'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface Order {
    id: string;
    name: string;
    lastname: string;
    adress: string;
    apartment?: string;
    company?: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
    courier: string | null;
    courierService?: string | null;
    total: number;
}

interface PrintableShippingLabelProps {
    order: Order;
}

export default function PrintableShippingLabel({ order }: PrintableShippingLabelProps) {
    const qrPayload = JSON.stringify({
        v: 1,
        orderId: order.id,
        checksum: order.id.substring(0, 4)
    });

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @media print {
                        /* Hide everything on the page */
                        body > *:not(#printable-label) {
                            display: none !important;
                        }
                        
                        /* Show only the label */
                        #printable-label {
                            display: block !important;
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            visibility: visible !important;
                        }
                        
                        /* A6 Landscape page setup */
                        @page {
                            size: A6 landscape;
                            margin: 0;
                        }
                        
                        /* Ensure proper sizing */
                        html, body {
                            width: 148mm;
                            height: 105mm;
                            margin: 0;
                            padding: 0;
                        }
                        
                        /* Remove any default browser print styles */
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                    
                    /* Hide on screen */
                    @media screen {
                        #printable-label {
                            display: none;
                        }
                    }
                `
            }} />

            <div id="printable-label" style={{
                width: '148mm',
                height: 'auto',
                minHeight: '105mm',
                padding: '12mm',
                fontFamily: 'Arial, sans-serif',
                background: 'white',
                color: 'black',
                fontSize: '9pt',
                boxSizing: 'border-box',
                pageBreakAfter: 'always'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8mm',
                    borderBottom: '2px dashed #ccc',
                    paddingBottom: '6mm'
                }}>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontSize: '18pt',
                            fontWeight: 800,
                            letterSpacing: '1px',
                            marginBottom: '2mm'
                        }}>
                            <span style={{ color: '#ff6b35' }}>ELOQO</span>
                            <span>.CO</span>
                        </div>
                        <div style={{ fontSize: '8pt', color: '#666', marginBottom: '4mm' }}>
                            INV/{order.id.substring(0, 13)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6mm' }}>
                            <span style={{ fontSize: '12pt', fontWeight: 'bold', color: '#ff6b35' }}>
                                {order.courier || 'N/A'}
                            </span>
                            <span>{order.courierService || 'Regular'}</span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12pt', fontWeight: 'bold' }}>
                            {order.id.substring(0, 13).toUpperCase()}
                        </div>
                        <div style={{ fontSize: '7pt', color: '#999', fontStyle: 'italic', marginTop: '2mm' }}>
                            Kode Booking Ini Bukan No Resi Pengiriman
                        </div>
                    </div>
                </div>

                {/* Payment Notice */}
                <div style={{
                    background: '#f5f5f5',
                    border: '1px solid #ccc',
                    padding: '5mm',
                    margin: '6mm 0',
                    fontSize: '8pt',
                    lineHeight: 1.5
                }}>
                    <div style={{ fontWeight: 600, color: '#16a34a', marginBottom: '2mm' }}>
                        Pembayaran: Non Tunai
                    </div>
                    <div>Penjual tidak perlu bayar apapun ke kurir, sudah dibayarkan otomatis.</div>
                </div>

                {/* Shipping Info */}
                <div style={{
                    display: 'flex',
                    gap: '10mm',
                    margin: '6mm 0',
                    borderBottom: '1px dashed #ccc',
                    paddingBottom: '6mm'
                }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '9pt', marginBottom: '4mm' }}>
                            Kepada:
                        </div>
                        <div style={{ marginBottom: '2mm' }}>
                            <div style={{ fontWeight: 'bold' }}>{order.name} {order.lastname}</div>
                        </div>
                        <div style={{ color: '#333', lineHeight: 1.5 }}>
                            {order.adress}
                            {order.apartment && `, ${order.apartment}`}
                            <br />
                            {order.company && `${order.company}, `}
                            {order.city}
                            <br />
                            {order.country}
                            <br />
                            {order.phone}
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '9pt', marginBottom: '4mm' }}>
                            Dari:
                        </div>
                        <div style={{ marginBottom: '2mm' }}>
                            <div style={{ fontWeight: 'bold' }}>ELOCO E-Commerce</div>
                        </div>
                        <div style={{ color: '#333', lineHeight: 1.5 }}>
                            Jl. Contoh Alamat Toko
                            <br />
                            Jakarta Selatan, DKI Jakarta
                            <br />
                            Indonesia
                            <br />
                            +62 812-3456-7890
                        </div>
                    </div>
                </div>

                {/* QR Code */}
                <div style={{ textAlign: 'center', marginTop: '6mm' }}>
                    <QRCodeSVG
                        value={qrPayload}
                        size={80}
                        level="M"
                    />
                    <div style={{ fontSize: '7pt', marginTop: '3mm', color: '#666' }}>
                        Scan untuk verifikasi order
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    marginTop: '8mm',
                    textAlign: 'center',
                    fontSize: '7pt',
                    color: '#999',
                    borderTop: '1px solid #eee',
                    paddingTop: '3mm'
                }}>
                    Kode Pos: {order.postalCode} | Powered by ELOCO E-Commerce
                </div>
            </div>
        </>
    );
}
