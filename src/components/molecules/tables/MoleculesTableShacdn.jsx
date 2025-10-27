import PropTypes from 'prop-types';
import { Pencil, Trash2 } from 'lucide-react';
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from '@src/components/ui/table';

/**
 * Componente de tabla genérica reutilizable.
 * Props:
 * - columns: [{ key, label, cell? }] where cell is optional function(row) => node
 * - rows: array de objetos (cada fila debe tener `id` único)
 * - headerTitle, headerDescription: textos para encabezado opcional
 * - headerActions: React node para acciones del encabezado (botón crear, filtros, etc.)
 * - onEdit, onDelete: funciones opcionales recibidas con (id)
 * - className: clases adicionales para contenedor
 */
function MoleculesTableShacdn({
	columns = [],
	rows = [],
	headerTitle = null,
	headerDescription = null,
	headerActions = null,
		onEdit = null,
		onDelete = null,
		renderActions = null,
	className = '',
}) {
	return (
		<div className={className}>
			{(headerTitle || headerDescription || headerActions) && (
				<div className="px-4 mb-2">
					<div className="flex items-center justify-between">
						<div>
							{headerTitle && <div className="text-xl font-medium">{headerTitle}</div>}
							{headerDescription && (
								<div className="text-sm text-muted-foreground">{headerDescription}</div>
							)}
						</div>
						{headerActions}
					</div>
				</div>
			)}

			<Table>
				<TableHeader>
					<tr>
						{columns.map((col) => (
							<TableHead key={col.key}>{col.label}</TableHead>
						))}
						{(onEdit || onDelete) && <TableHead>Acciones</TableHead>}
					</tr>
				</TableHeader>

				<TableBody>
					{rows.map((row) => (
						<TableRow key={row.id} className="align-middle">
							{columns.map((col) => (
								<TableCell key={col.key} className="p-2">
									{typeof col.cell === 'function' ? col.cell(row) : row[col.key]}
								</TableCell>
							))}

											{(onEdit || onDelete || renderActions) && (
												<TableCell className="p-2 text-right">
													<div className="inline-flex items-center space-x-2">
														{typeof renderActions === 'function'
															? renderActions(row)
															: (
																<>
																	{onEdit && (
																		<button
																			type="button"
																			onClick={() => onEdit(row.id)}
																			className="p-1 rounded hover:bg-gray-100"
																			aria-label={`Editar ${row?.nombre || row.id}`}
																			title="Editar"
																		>
																			<Pencil className="h-5 w-5 text-blue-600" />
																		</button>
																	)}

																	{onDelete && (
																		<button
																			type="button"
																			onClick={() => onDelete(row.id)}
																			className="p-1 rounded hover:bg-gray-100"
																			aria-label={`Eliminar ${row?.nombre || row.id}`}
																			title="Eliminar"
																		>
																			<Trash2 className="h-5 w-5 text-red-600" />
																		</button>
																	)}
																</>
															)}
													</div>
												</TableCell>
											)}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

MoleculesTableShacdn.propTypes = {
	columns: PropTypes.array,
	rows: PropTypes.array,
	headerTitle: PropTypes.node,
	headerDescription: PropTypes.node,
	headerActions: PropTypes.node,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
		renderActions: PropTypes.func,
	className: PropTypes.string,
};

MoleculesTableShacdn.defaultProps = {
	columns: [],
	rows: [],
	headerTitle: null,
	headerDescription: null,
	headerActions: null,
	onEdit: null,
	onDelete: null,
		renderActions: null,
	className: '',
};

export default MoleculesTableShacdn;

