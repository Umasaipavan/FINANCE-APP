'use client'
import { deleteTransaction } from "@/lib/actions";
import Button from "./button";
import { X, Loader } from 'lucide-react';
import { useState } from "react";

interface TransactionItemRemoveButtonProps {
  id: string;
  onRemoved: () => void;
}

export default function TransactionItemRemoveButton({ id, onRemoved }: TransactionItemRemoveButtonProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [confirmed, setConfirmed] = useState<boolean>(false)
  const handleClick = async () => {
    if (!confirmed) {
      setConfirmed(true)
      return
    }
    try {
      setLoading(true)
      await deleteTransaction(id)
      onRemoved()
    } finally {
      setLoading(false)
    }
  }
  return <Button size="xs" variant={!confirmed ? 'ghost' : 'danger'} onClick={handleClick} aria-disabled={loading}>
    {!loading && <X className="w-4 h-4" />}
    {loading && <Loader className="w-4 h-4 animate-spin" />}
  </Button>
}