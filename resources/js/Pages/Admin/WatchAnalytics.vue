<template>
  <AdminLayout>
    <!-- Header -->
    <div class="bg-card border-b border-border shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div>
            <h1 class="text-2xl font-bold text-foreground">Watch Analytics</h1>
            <p class="text-muted-foreground">View streaming statistics and viewer engagement</p>
          </div>
          <Link
            href="/admin/page-content"
            class="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft class="h-4 w-4 mr-2" />
            Back to Movies
          </Link>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Viewers -->
        <div class="bg-card rounded-lg shadow border border-border p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Total Viewers</p>
              <p class="text-3xl font-bold text-foreground">{{ stats.totalViewers }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Total Watch Time -->
        <div class="bg-card rounded-lg shadow border border-border p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Total Watch Time</p>
              <p class="text-3xl font-bold text-foreground">{{ stats.totalWatchTimeHours }}h</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Clock class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <!-- Avg Watch % -->
        <div class="bg-card rounded-lg shadow border border-border p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Avg Watch Progress</p>
              <p class="text-3xl font-bold text-foreground">{{ stats.avgWatchPercentage }}%</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <!-- Completion Rate -->
        <div class="bg-card rounded-lg shadow border border-border p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Completion Rate</p>
              <p class="text-3xl font-bold text-foreground">{{ stats.completionRate }}%</p>
              <p class="text-xs text-muted-foreground">{{ stats.completedViewers }} viewers</p>
            </div>
            <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <CheckCircle class="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Viewers by Day Chart -->
        <div class="bg-card rounded-lg shadow border border-border p-6">
          <h3 class="text-lg font-semibold text-foreground mb-4">Viewers (Last 30 Days)</h3>
          <div v-if="viewersByDay.length > 0" class="h-64">
            <div class="flex items-end h-48 gap-1">
              <div
                v-for="(day, index) in viewersByDay"
                :key="index"
                class="flex-1 flex flex-col items-center"
              >
                <div
                  class="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                  :style="{ height: `${getBarHeight(day.viewers, maxViewers)}%` }"
                  :title="`${day.date}: ${day.viewers} viewers`"
                ></div>
              </div>
            </div>
            <div class="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{{ viewersByDay[0]?.date }}</span>
              <span>{{ viewersByDay[viewersByDay.length - 1]?.date }}</span>
            </div>
          </div>
          <div v-else class="h-64 flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </div>

        <!-- Watch Distribution Chart -->
        <div class="bg-card rounded-lg shadow border border-border p-6">
          <h3 class="text-lg font-semibold text-foreground mb-4">Watch Progress Distribution</h3>
          <div class="space-y-3">
            <div v-for="(item, index) in watchDistribution" :key="index" class="flex items-center gap-3">
              <span class="text-sm text-muted-foreground w-20">{{ item.range }}</span>
              <div class="flex-1 h-6 bg-muted rounded overflow-hidden">
                <div
                  class="h-full rounded transition-all"
                  :class="getDistributionColor(index)"
                  :style="{ width: `${getDistributionWidth(item.count)}%` }"
                ></div>
              </div>
              <span class="text-sm font-medium text-foreground w-12 text-right">{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Hourly Pattern -->
      <div class="bg-card rounded-lg shadow border border-border p-6 mb-8">
        <h3 class="text-lg font-semibold text-foreground mb-4">Viewing Pattern by Hour</h3>
        <div class="h-32 flex items-end gap-1">
          <div
            v-for="(hour, index) in hourlyPattern"
            :key="index"
            class="flex-1 flex flex-col items-center"
          >
            <div
              class="w-full bg-purple-500 rounded-t transition-all hover:bg-purple-600"
              :style="{ height: `${getBarHeight(hour.views, maxHourlyViews)}%` }"
              :title="`${hour.hour}: ${hour.views} views`"
            ></div>
          </div>
        </div>
        <div class="flex justify-between text-xs text-muted-foreground mt-2">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:00</span>
        </div>
      </div>

      <!-- Tables Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Viewers -->
        <div class="bg-card rounded-lg shadow border border-border p-6">
          <h3 class="text-lg font-semibold text-foreground mb-4">Top Viewers</h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border">
                  <th class="text-left text-sm font-medium text-muted-foreground py-2">User</th>
                  <th class="text-left text-sm font-medium text-muted-foreground py-2">Watch Time</th>
                  <th class="text-left text-sm font-medium text-muted-foreground py-2">Last Active</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="viewer in topViewers" :key="viewer.email" class="border-b border-border/50">
                  <td class="py-3">
                    <div class="text-sm font-medium text-foreground">{{ viewer.user }}</div>
                    <div class="text-xs text-muted-foreground">{{ viewer.email }}</div>
                  </td>
                  <td class="py-3 text-sm text-foreground">{{ viewer.total_time }}</td>
                  <td class="py-3 text-sm text-muted-foreground">{{ viewer.last_watched }}</td>
                </tr>
              </tbody>
            </table>
            <div v-if="topViewers.length === 0" class="text-center py-4 text-muted-foreground">
              No viewers yet
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-card rounded-lg shadow border border-border p-6">
          <h3 class="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="(activity, index) in recentActivity"
              :key="index"
              class="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
            >
              <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Play class="w-4 h-4 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-foreground truncate">{{ activity.user }}</p>
                <p class="text-xs text-muted-foreground">{{ activity.current_time }} watched</p>
              </div>
              <div class="text-right flex-shrink-0">
                <div class="w-16 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    class="h-full bg-green-500 rounded-full"
                    :style="{ width: `${activity.progress}%` }"
                  ></div>
                </div>
                <p class="text-xs text-muted-foreground mt-1">{{ activity.progress }}%</p>
              </div>
            </div>
            <div v-if="recentActivity.length === 0" class="text-center py-4 text-muted-foreground">
              No recent activity
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { Link } from '@inertiajs/vue3'
import { computed } from 'vue'
import { ArrowLeft, Users, Clock, TrendingUp, CheckCircle, Play } from 'lucide-vue-next'
import AdminLayout from '@/Layouts/AdminLayout.vue'

const props = defineProps({
  stats: { type: Object, default: () => ({}) },
  viewersByDay: { type: Array, default: () => [] },
  watchDistribution: { type: Array, default: () => [] },
  topViewers: { type: Array, default: () => [] },
  recentActivity: { type: Array, default: () => [] },
  hourlyPattern: { type: Array, default: () => [] },
})

const maxViewers = computed(() => Math.max(...props.viewersByDay.map(d => d.viewers), 1))
const maxHourlyViews = computed(() => Math.max(...props.hourlyPattern.map(h => h.views), 1))
const maxDistribution = computed(() => Math.max(...props.watchDistribution.map(d => d.count), 1))

const getBarHeight = (value, max) => {
  if (max === 0) return 0
  return Math.max((value / max) * 100, 2)
}

const getDistributionWidth = (count) => {
  if (maxDistribution.value === 0) return 0
  return Math.max((count / maxDistribution.value) * 100, 2)
}

const getDistributionColor = (index) => {
  const colors = [
    'bg-red-400',
    'bg-orange-400',
    'bg-yellow-400',
    'bg-lime-400',
    'bg-green-400',
    'bg-emerald-500',
  ]
  return colors[index] || 'bg-blue-400'
}
</script>
