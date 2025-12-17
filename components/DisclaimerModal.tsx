
import React from 'react';
import { OFFICIAL_LINKS } from '../constants';

interface DisclaimerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

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
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mb-4">
                            <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>

                        <h3 className="text-lg font-semibold leading-6 text-slate-900 mb-2">
                            Unofficial Tool
                        </h3>

                        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                            This OINP Navigator is an <strong>independent, community-maintained tool</strong> designed to help candidates estimate scores.
                            <br /><br />
                            It is <strong>not affiliated with, endorsed by, or connected to</strong> the Government of Ontario or the Ontario Immigrant Nominee Program.
                        </p>

                        <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200 text-left">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Official Resources</p>
                            <ul className="space-y-2">
                                {OFFICIAL_LINKS.map((link) => (
                                    <li key={link.url}>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                                        >
                                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                            </svg>
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <p className="text-xs text-slate-400 italic mb-0">
                            Always verify your eligibility and requirements on the official Government of Ontario website.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisclaimerModal;
