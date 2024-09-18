import React, { useMemo } from 'react'
import { SubmittedContract, VerificationReceipt } from '../types'
import { shortenAddress, CustomTooltip } from '@remix-ui/helper'
import { AppContext } from '../AppContext'
import { CopyToClipboard } from '@remix-ui/clipboard'

interface AccordionReceiptProps {
  contract: SubmittedContract
  index: number
}

export const AccordionReceipt: React.FC<AccordionReceiptProps> = ({ contract, index }) => {
  const { chains } = React.useContext(AppContext)

  const [expanded, setExpanded] = React.useState(false)

  const chain = useMemo(() => {
    return chains.find((c) => c.chainId === parseInt(contract.chainId))
  }, [contract, chains])
  const chainName = chain?.name ?? 'Unknown Chain'

  const hasProxy = contract.proxyAddress && contract.proxyReceipts

  const toggleAccordion = () => {
    setExpanded(!expanded)
  }

  return (
    <div className={`${expanded ? 'bg-light' : 'border-bottom '}`}>
      <div className="d-flex flex-row align-items-center">
        <button className="btn" onClick={toggleAccordion} style={{ padding: '0.45rem' }}>
          <i className={`fas ${expanded ? 'fa-angle-down' : 'fa-angle-right'} text-secondary`}></i>
        </button>

        <div className="small w-100 text-uppercase overflow-hidden text-break text-nowrap">
          <CustomTooltip placement="top" tooltipClasses="text-nowrap" tooltipText={`Contract: ${contract.contractName},  Address: ${contract.address}, Chain: ${chainName}, Proxy: ${contract.proxyAddress}`}>
            <span>
              {contract.contractName} at {shortenAddress(contract.address)} {contract.proxyAddress ? 'with proxy' : ''}
            </span>
          </CustomTooltip>
        </div>

        <button className="btn" style={{ padding: '0.15rem' }}>
          <CopyToClipboard tip="Copy" content={contract.address} direction={'top'} />
        </button>
      </div>

      <div className={`${expanded ? '' : 'd-none'} px-2 pt-2 pb-3 small`}>
        <div>
          <span className="font-weight-bold">Chain: </span>
          {chainName} ({contract.chainId})
        </div>
        <div>
          <span className="font-weight-bold">File: </span>
          <span className="text-break">{contract.filePath}</span>
        </div>
        <div>
          <span className="font-weight-bold">Submitted at: </span>
          {new Date(contract.date).toLocaleString()}
        </div>

        <div>
          <span className="font-weight-bold">Verified at: </span>
          <ReceiptsBody receipts={contract.receipts} />
        </div>

        {hasProxy && (
          <>
            <div className="mt-3">
              <span className="font-weight-bold">Proxy Address: </span>
              <CustomTooltip placement="top" tooltipClasses="text-nowrap" tooltipText={contract.proxyAddress}>
                <span>{shortenAddress(contract.proxyAddress)}</span>
              </CustomTooltip>
              <CopyToClipboard tip="Copy" content={contract.proxyAddress} direction={'top'} />
            </div>
            <div>
              <span className="font-weight-bold">Proxy verified at: </span>
              <ReceiptsBody receipts={contract.proxyReceipts} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const ReceiptsBody = ({ receipts }: { receipts: VerificationReceipt[] }) => {
  return (
    <ul className="list-group">
      {receipts.map((receipt) => (
        <li className="list-group-item">
          <CustomTooltip placement="top" tooltipText={`API: ${receipt.verifierInfo.apiUrl}`}>
            <span className="font-weight-bold medium">{receipt.verifierInfo.name}</span>
          </CustomTooltip>

          <CustomTooltip placement="top" tooltipTextClasses="text-capitalize" tooltipText={`Status: ${receipt.status}${receipt.message ? `, Message: ${receipt.message}` : ''}`}>
            <span className="ml-2">{['verified', 'partially verified', 'already verified'].includes(receipt.status) ? <i className="fas fa-check"></i> : receipt.status === 'fully verified' ? <i className="fas fa-check-double"></i> : receipt.status === 'failed' ? <i className="fas fa-xmark"></i> : ['pending', 'awaiting implementation verification'].includes(receipt.status) ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-question"></i>}</span>
          </CustomTooltip>

          <span className="ml-2">{!!receipt.lookupUrl && <a href={receipt.lookupUrl} target="_blank" className="fa fas fa-arrow-up-right-from-square"></a>}</span>
        </li>
      ))}
    </ul>
  )
}
