'use client'

import { useDashboardViewBoardQuery } from '@/features/dashboard'
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts'
import { BoardDetailResponse } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
    board: BoardDetailResponse['data']
}

export function DashboardView({ board }: Props) {
    const { data, isLoading, isError } = useDashboardViewBoardQuery(board.id)

    if (isLoading) {
        return <div className="p-4">Loading dashboard...</div>
    }

    if (isError || !data) {
        return <div className="p-4 text-destructive">Failed to load dashboard</div>
    }

    const { cardsByList, cardsByMember, cardsByLabel, cardsByDueDate } = data.data

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-y-auto">
            {/* Cards by List */}
            <Card>
                <CardHeader>
                    <CardTitle>Cards by List</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                    <ResponsiveContainer>
                        <BarChart data={cardsByList}>
                            <XAxis dataKey="listName" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Cards by Member */}
            <Card>
                <CardHeader>
                    <CardTitle>Cards by Member</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={cardsByMember}
                                dataKey="count"
                                nameKey="userName"
                                outerRadius={100}
                                label
                            >
                                {cardsByMember.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Cards by Label */}
            <Card>
                <CardHeader>
                    <CardTitle>Cards by Label</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={cardsByLabel}
                                dataKey="count"
                                nameKey="name"
                                outerRadius={100}
                                label
                            >
                                {cardsByLabel.map((l) => (
                                    <Cell key={l.id} fill={l.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Cards by Due Date */}
            <Card>
                <CardHeader>
                    <CardTitle>Cards by Due Date</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                    <ResponsiveContainer>
                        <LineChart data={cardsByDueDate}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#3b82f6" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
