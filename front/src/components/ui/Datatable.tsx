import { Button } from "@mui/material";
import { motion } from "framer-motion";

export const CustomDataTable = ({ title, data, columns, onAction }: {
    title: string;
    data: any[];
    columns: { name: string; label: string; actions?: boolean }[];
    onAction?: (id: number, action: string) => void;
  }) => {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700/50">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {data.map((row, rowIndex) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: rowIndex * 0.1 }}
                  className="hover:bg-gray-700/30 transition-colors duration-200"
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 text-sm text-gray-300">
                      {column.actions ? (
                        <div className="flex gap-2">
                          {title.includes('invités') ? (
                            <>
                              <Button
                                variant="contained"
                                size="small"
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs font-medium rounded-lg transition-colors"
                                onClick={() => onAction?.(row.id, 'accept')}
                              >
                                Accepter
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs font-medium rounded-lg transition-colors"
                                onClick={() => onAction?.(row.id, 'deny')}
                              >
                                Refuser
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="contained"
                              size="small"
                              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 text-xs font-medium rounded-lg transition-colors"
                              onClick={() => onAction?.(row.id, 'ban')}
                            >
                              Bannir
                            </Button>
                          )}
                        </div>
                      ) : (
                        row[column.name]
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {data.length === 0 && (
          <div className="px-6 py-8 text-center">
            <div className="text-gray-400 text-sm">Aucune donnée disponible</div>
          </div>
        )}
      </div>
    );
  };
  