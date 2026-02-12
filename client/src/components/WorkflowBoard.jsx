import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TaskItem } from './TaskItem';
import clsx from 'clsx';

const COLUMNS = {
    'Not Started': { title: 'Not Started', color: 'bg-gray-50 border-gray-200' },
    'In Progress': { title: 'In Progress', color: 'bg-blue-50 border-blue-200' },
    'Completed': { title: 'Completed', color: 'bg-green-50 border-green-200' }
};

export function WorkflowBoard({ tasks, onDragEnd, onEdit, onDelete }) {
    // Group tasks by status
    const columns = {
        'Not Started': tasks.filter(t => t.Status === 'Not Started'),
        'In Progress': tasks.filter(t => t.Status === 'In Progress'),
        'Completed': tasks.filter(t => t.Status === 'Completed'),
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {Object.entries(COLUMNS).map(([columnId, config]) => (
                    <div key={columnId} className={clsx("rounded-2xl p-5 border border-transparent shadow-sm flex flex-col h-full bg-opacity-60", config.color)}>
                        <h3 className="font-bold text-gray-700 mb-4 flex justify-between items-center text-lg">
                            {config.title}
                            <span className="bg-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm text-gray-600">
                                {columns[columnId]?.length || 0}
                            </span>
                        </h3>

                        <Droppable droppableId={columnId}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={clsx(
                                        "flex flex-col gap-3 min-h-[400px] transition-all rounded-xl",
                                        snapshot.isDraggingOver ? "bg-white/50 ring-2 ring-blue-400 border-transparent p-2" : ""
                                    )}
                                >
                                    {columns[columnId]?.map((task, index) => (
                                        <Draggable key={task.TaskId} draggableId={task.TaskId} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{ ...provided.draggableProps.style }}
                                                    className={snapshot.isDragging ? "opacity-90 rotate-2 scale-105" : ""}
                                                >
                                                    <TaskItem
                                                        task={task}
                                                        onEdit={onEdit}
                                                        onDelete={onDelete}
                                                    />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
}
