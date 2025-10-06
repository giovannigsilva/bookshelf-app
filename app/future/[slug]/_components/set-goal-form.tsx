'use client'; 

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function SetGoalForm() {
  const [goalType, setGoalType] = useState('livros');
  const [quantity, setQuantity] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const handleSubmit = () => {
    if (!quantity) {
      alert('Por favor, defina uma quantidade.');
      return;
    }
    const goal = {
      type: goalType,
      quantity: Number(quantity),
      year: Number(year),
    };
    console.log('Nova meta definida:', goal);
    alert(`Meta definida: Ler ${quantity} ${goalType} em ${year}!`);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Definir meta de leitura</CardTitle>
        <CardDescription>
          Escolha seu objetivo para este ano e acompanhe seu progresso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="goal-type">Meta para livros ou páginas? </Label>
            <Select value={goalType} onValueChange={setGoalType}>
              <SelectTrigger id="goal-type">
                <SelectValue placeholder="Selecione o tipo de meta" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="livros">Livros</SelectItem>
                <SelectItem value="paginas">Páginas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantidade:</Label>
              <Input 
                id="quantity" 
                type="number" 
                placeholder="Ex: 24" 
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="year">No ano de:</Label>
               <Select value={year} onValueChange={setYear}>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit}>Salvar Meta</Button>
      </CardFooter>
    </Card>
  );
}
