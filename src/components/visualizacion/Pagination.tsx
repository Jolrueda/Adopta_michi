import React from "react";

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   totalItems,
                                                   itemsPerPage,
                                                   currentPage,
                                                   onPageChange,
                                               }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleClick = (page: number) => {
        if (page > 0 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="flex justify-center mt-4 gap-2">
            {/* Botón de Anterior */}
            <button
                onClick={() => handleClick(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 bg-gray-300 text-gray-600 rounded ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                Anterior
            </button>

            {/* Lista de páginas */}
            <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handleClick(index + 1)}
                        className={`p-2 rounded ${
                            currentPage === index + 1
                                ? "bg-purple-600 text-white"
                                : "bg-gray-300 text-gray-600"
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* Botón de Siguiente */}
            <button
                onClick={() => handleClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 bg-purple-600 text-white rounded ${
                    currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
                Siguiente
            </button>
        </div>
    );
};

export default Pagination;
