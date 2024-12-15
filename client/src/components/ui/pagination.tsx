import React from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showThreePages?: boolean
}

export function Pagination({ currentPage, totalPages, onPageChange, showThreePages = false }: PaginationProps) {
  const renderPageNumbers = () => {
    const pageNumbers: React.ReactNode[] = []
    if (totalPages <= 1) return pageNumbers

    pageNumbers.push(
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "outline"}
        onClick={() => onPageChange(1)}
      >
        1
      </Button>
    )

    if (showThreePages) {
      if (currentPage > 2) {
        pageNumbers.push(<span key="ellipsis1">...</span>)
      }

      if (currentPage !== 1 && currentPage !== totalPages) {
        pageNumbers.push(
          <Button
            key={currentPage}
            variant="default"
            onClick={() => onPageChange(currentPage)}
          >
            {currentPage}
          </Button>
        )
      }

      if (currentPage < totalPages - 1) {
        pageNumbers.push(<span key="ellipsis2">...</span>)
      }
    } else {
      if (currentPage > 3) {
        pageNumbers.push(<span key="ellipsis1">...</span>)
      }

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pageNumbers.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            onClick={() => onPageChange(i)}
          >
            {i}
          </Button>
        )
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push(<span key="ellipsis2">...</span>)
      }
    }

    if (totalPages > 1) {
      pageNumbers.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "outline"}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Button>
      )
    }

    return pageNumbers
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <Button
        variant="outline"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {renderPageNumbers()}
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

