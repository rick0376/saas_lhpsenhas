"use client";

import { LucideIcon } from "lucide-react";
import styles from "./styles.module.scss";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "purple" | "orange";
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
}: StatsCardProps) {
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper}>
          <Icon size={24} />
        </div>
        {trend && (
          <span
            className={`${styles.trend} ${
              trend.isPositive ? styles.positive : styles.negative
            }`}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );
}
