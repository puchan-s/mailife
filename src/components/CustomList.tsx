import React, { useState, useEffect, useImperativeHandle, forwardRef, ForwardedRef } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, sortableKeyboardCoordinates, DragOverlay, MouseSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export class listData {
    private id: string;
    private viewTextFunc: (data: listData) => Element;
    private masterData: object;

    constructor(id: number, viewTextFunc: (data: listData) => Element, masterData: object) {
        this.id = id.toString();
        this.viewTextFunc = viewTextFunc;
        this.masterData = masterData;
    }

    getId() {
        return this.id;
    }

    getViewText() {
        return this.viewTextFunc(this);
    }

    getMasterData() {
        return this.masterData;
    }

    setMasterData(masterData:object){
        return this.masterData = masterData;
    }
}

interface DraggableItemProps {
    id: string;
    children: React.ReactNode;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '16px',
        margin: '0 0 8px 0',
        backgroundColor: '#456C86',
        color: 'white',
        borderRadius: '4px',
        cursor: 'grab',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
};

interface CustomListProps {
    data: listData[];
    addFunc?: (nextId: number) => listData
}

export interface CustomListHandle {
    getData: () => listData[];
    setData: (data: listData[]) => void;
    getItemMaxId: () => number
}

export const CustomList = forwardRef<CustomListHandle, (CustomListProps)>((props, ref) => {
    const [items, setItems] = useState<listData[]>([]);
    const [itemMaxId, setItemMaxId] = useState<number>(0);
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        // 初期データの設定などがある場合はここに記述
        setItems(props.data);
        if (props.data.length === 0) {
            setItemMaxId(0);
        } else {
            setItemMaxId(Number(props.data[props.data.length - 1].getId()));
        }
    }, []);

    useImperativeHandle(ref, () => ({
        getData: () => items,
        setData: (data: listData[]) => setItems(data),
        getItemMaxId: (() => {
            const id = itemMaxId + 1;
            setItemMaxId(id);
            return id;
        })
    }));

    // const sensors = useSensors(
    //     useSensor(PointerSensor),
    //     useSensor(KeyboardSensor, {
    //         coordinateGetter: sortableKeyboardCoordinates,
    //     })
    // );

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } })
    );

    const handleDragStart = (event: { active: { id: string } }) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: { active: { id: string }; over: { id: string } }) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            let workItems = items;
            const oldIndex = items.findIndex((item) => item.getId() === active.id);
            const newIndex = items.findIndex((item) => item.getId() === over.id);
            workItems = arrayMove(items, oldIndex, newIndex);
            setItems(workItems);
        }
        setActiveId(null);
    };

    return (
        <div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={items.map((item) => item.getId())} strategy={verticalListSortingStrategy}>
                    {items.map((item) => (
                        <DraggableItem key={item.getId()} id={item.getId()}>
                            {item.getViewText()}
                        </DraggableItem>
                    ))}
                </SortableContext>
                <DragOverlay>
                    {activeId ? (
                        <div style={{ padding: '16px', backgroundColor: '#456C86', color: 'white', borderRadius: '4px', cursor: 'grab' }}>
                            {items.find((item) => item.getId() === activeId)?.getViewText()}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
});

