
import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { BITCOIN_ADDRESS } from '../constants';

interface DonateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(BITCOIN_ADDRESS);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Modal Panel */}
                <div className="relative transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all sm:w-full sm:max-w-md border border-slate-100">

                    {/* Close button */}
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={onClose}
                            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-500 transition-colors"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 mb-4">
                            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>

                        <h3 className="text-lg font-semibold leading-6 text-slate-900 mb-2">
                            Support Our Work
                        </h3>

                        <p className="text-sm text-slate-500 mb-6">
                            If you found this tool helpful for your OINP journey, consider supporting its development.
                        </p>

                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-6 flex justify-center">
                            <QRCode
                                value={BITCOIN_ADDRESS}
                                size={160}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                viewBox={`0 0 256 256`}
                            />
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bitcoin Address</p>
                                {copied && (
                                    <span className="text-xs text-green-600 font-medium animate-fade-in">
                                        Copied!
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between gap-2 bg-white p-2 rounded border border-slate-200">
                                <code className="text-xs text-slate-800 break-all font-mono select-all">
                                    {BITCOIN_ADDRESS}
                                </code>
                                <button
                                    onClick={handleCopy}
                                    className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors shrink-0"
                                    title="Copy to clipboard"
                                >
                                    {copied ? (
                                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonateModal;
