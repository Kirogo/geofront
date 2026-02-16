import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SiteVisitReport } from '@/types/report.types'

interface ReportsTableProps {
    reports: SiteVisitReport[]
}

const PRIMARY_BLUE = '#164679'
const ACCENT_LIME = '#b5d334'
const HIGHLIGHT_GOLD = '#fcb116'
const LIGHT_YELLOW = '#fcd716'
const SECONDARY_PURPLE = '#7e6496'

export const ReportsTable: React.FC<ReportsTableProps> = ({ reports }) => {
    const navigate = useNavigate()

    const handleRowClick = (reportId: string) => {
        navigate(`/rm/reports/${reportId}`)
    }

    return (
        <>
            <style>{`
        .reports-table-wrapper {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(22, 70, 121, 0.08);
          border: 1px solid #e0e0e0;
        }
        .reports-table {
          width: 100%;
          border-collapse: collapse;
        }
        .reports-table thead tr th {
          background-color: #f7f7f7 !important;
          color: ${PRIMARY_BLUE} !important;
          font-weight: 700;
          font-size: 15px;
          padding: 16px 16px !important;
          border-bottom: 3px solid ${ACCENT_LIME} !important;
          text-align: left;
        }
        .reports-table tbody tr td {
          border-bottom: 1px solid #f0f0f0 !important;
          padding: 14px 16px !important;
          font-size: 14px;
          color: #333;
        }
        .reports-table tbody tr:hover td {
          background-color: rgba(181, 211, 52, 0.1) !important;
          cursor: pointer;
        }
        .reports-table tbody tr:nth-child(even) {
          background-color: #f9fafb;
        }
      `}</style>

            <div className="reports-table-wrapper">
                <table className="reports-table">
                    <thead>
                        <tr>
                            <th style={{ width: '180px' }}>Site Visit No</th>
                            <th style={{ width: '180px' }}>Customer Name</th>
                            <th style={{ width: '150px' }}>Customer Number</th>
                            <th style={{ width: '140px' }}>IBPS No</th>
                            <th style={{ width: '140px' }}>Project Name</th>
                            <th style={{ width: '120px' }}>Assigned RM</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
                                    No site visits created yet
                                </td>
                            </tr>
                        ) : (
                            reports.map((report) => (
                                <tr key={report.id} onClick={() => handleRowClick(report.id)}>
                                    <td>
                                        <span style={{ fontWeight: 'bold', color: PRIMARY_BLUE }}>
                                            {report.reportNumber}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ color: SECONDARY_PURPLE }}>
                                            {report.client?.name || 'N/A'}
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ color: PRIMARY_BLUE, fontWeight: 500 }}>
                                            {report.client?.customerNumber || 'N/A'}
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            style={{
                                                color: PRIMARY_BLUE,
                                                fontWeight: 500,
                                                fontFamily: 'monospace',
                                                backgroundColor: report.ibpsNo ? 'rgba(181, 211, 52, 0.1)' : 'transparent',
                                                padding: '2px 6px',
                                                borderRadius: 4,
                                                fontSize: 13,
                                            }}
                                        >
                                            {report.ibpsNo || 'Not set'}
                                        </span>
                                    </td>
                                    <td>{report.client?.projectName || 'N/A'}</td>
                                    <td>
                                        <span style={{ color: PRIMARY_BLUE, fontWeight: '500' }}>
                                            Current User
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}
