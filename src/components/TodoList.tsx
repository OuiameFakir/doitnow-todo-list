import React from 'react';
import CardNote from './Card';
import { useTaskContext } from '../hooks/TaskContext';
import NavBar from './MyNavbar';
import { Col, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ITask } from '../types/Type';

const SortableCard: React.FC<{ task: ITask }> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };
  return (
    <Col>
      <div ref={setNodeRef} style={{ ...style, height: '100%' }} {...attributes} {...listeners}>
        <CardNote taskObj={task} />
      </div>
    </Col>
  );
};

const TodoList: React.FC = () => {
  const { filtredTasks, reorderTasks } = useTaskContext();
  const tasks = filtredTasks;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);
      reorderTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const doneCount = tasks.filter(t => t.done).length;
  const progressPct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <>
      <NavBar />
      <div className="container p-3">
        {tasks.length > 0 && (
          <div className="mb-3">
            <div className="d-flex justify-content-between mb-1">
              <small className="text-muted fw-semibold">Progress</small>
              <small className="text-muted">{doneCount} / {tasks.length} completed ({progressPct}%)</small>
            </div>
            <div className="progress" style={{ height: '10px' }}>
              <div
                className={`progress-bar ${progressPct === 100 ? 'bg-success' : 'bg-primary'}`}
                role="progressbar"
                style={{ width: `${progressPct}%`, transition: 'width 0.4s ease' }}
                aria-valuenow={progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        )}
        {tasks.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center text-muted" style={{ minHeight: '60vh' }}>
            <FontAwesomeIcon icon={faClipboardList} size="4x" className="mb-3 opacity-25" />
            <h5 className="fw-semibold">No tasks yet, create one!</h5>
            <p className="small">Hit the <strong>+ New</strong> button to get started.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={tasks.map(t => t.id)} strategy={rectSortingStrategy}>
              <Row xs={1} md={2} lg={3} className="g-4">
                {tasks.map((task) => (
                  <SortableCard key={task.id} task={task} />
                ))}
              </Row>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </>
  );
};

export default TodoList;