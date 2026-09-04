import { useCallback, useMemo, useState } from 'react'
import { resolve } from '../kit/resolve'
import { scheduleFor } from '../kit/schedule'
import type { Frequency, Material, Sku, Task } from '../kit/types'

/**
 * Хук не содержит ни одного правила ухода. Правила живут в kit/ и покрыты
 * тестами; здесь только ответы, ручные снятия и отмена снятия.
 */
export function useConfigurator() {
  const [material, setMaterial] = useState<Material | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [frequency, setFrequency] = useState<Frequency>('weekly')
  const [removed, setRemoved] = useState<Sku[]>([])

  const selectMaterial = useCallback((m: Material) => {
    setMaterial(m)
    // Ручные снятия относятся к конкретному набору. Пережив смену материала,
    // они молча вычтут позицию, которую пользователь не убирал.
    setRemoved([])
  }, [])

  const toggleTask = useCallback((task: Task, next: boolean) => {
    setTasks(prev => (next ? [...new Set([...prev, task])] : prev.filter(t => t !== task)))
    setRemoved([])
  }, [])

  const resolved = useMemo(
    () => (material ? resolve({ material, tasks, frequency }) : null),
    [material, tasks, frequency],
  )

  const items = useMemo(
    () => (resolved ? resolved.items.filter(p => !removed.includes(p.sku)) : []),
    [resolved, removed],
  )

  const schedule = useMemo(() => {
    if (items.length === 0) return null
    const s = scheduleFor(items, frequency)
    // Ни одного расходника — считать нечего, и напоминать не о чем.
    return s.firstToRunOut === null ? null : s
  }, [items, frequency])

  return {
    material, tasks, frequency, removed,
    items,
    conflicts: resolved?.conflicts ?? [],
    needsShade: resolved?.needsShade ?? false,
    schedule,
    selectMaterial,
    toggleTask,
    setFrequency,
    remove: useCallback((sku: Sku) => setRemoved(prev => [...new Set([...prev, sku])]), []),
    restore: useCallback((sku: Sku) => setRemoved(prev => prev.filter(s => s !== sku)), []),
    reset: useCallback(() => { setMaterial(null); setTasks([]); setRemoved([]) }, []),
  }
}
