"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { MissionChoice } from "@/lib/missions"
import { DollarSign, TrendingUp, Flower2, Heart } from "lucide-react"

interface ChoiceDialogProps {
  choices: MissionChoice[]
  currentMoney: number
  onChoose: (choice: MissionChoice) => void
}

export function ChoiceDialog({ choices, currentMoney, onChoose }: ChoiceDialogProps) {
  return (
    <Card className="p-6 border-2 border-primary/30">
      <h3 className="font-serif text-xl font-semibold text-primary mb-4 text-center">Toma tu Decisión</h3>

      <div className="grid gap-4">
        {choices.map((choice) => {
          const canAfford = currentMoney >= choice.cost

          return (
            <Card key={choice.id} className={`p-4 transition-all hover:shadow-lg ${!canAfford && "opacity-60"}`}>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{choice.label}</h4>
                  <p className="text-sm text-muted-foreground">{choice.description}</p>
                </div>

                {/* Effects preview */}
                <div className="flex flex-wrap gap-3 text-xs">
                  {choice.effects.money !== undefined && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span
                        className={choice.effects.money > 0 ? "text-success-foreground" : "text-destructive-foreground"}
                      >
                        {choice.effects.money > 0 ? "+" : ""}
                        {choice.effects.money}
                      </span>
                    </div>
                  )}
                  {choice.effects.productivity !== undefined && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span
                        className={
                          choice.effects.productivity > 0 ? "text-success-foreground" : "text-destructive-foreground"
                        }
                      >
                        {choice.effects.productivity > 0 ? "+" : ""}
                        {choice.effects.productivity}%
                      </span>
                    </div>
                  )}
                  {choice.effects.biodiversity !== undefined && (
                    <div className="flex items-center gap-1">
                      <Flower2 className="h-3 w-3" />
                      <span
                        className={
                          choice.effects.biodiversity > 0 ? "text-success-foreground" : "text-destructive-foreground"
                        }
                      >
                        {choice.effects.biodiversity > 0 ? "+" : ""}
                        {choice.effects.biodiversity}%
                      </span>
                    </div>
                  )}
                  {choice.effects.beaHealth !== undefined && (
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span
                        className={
                          choice.effects.beaHealth > 0 ? "text-success-foreground" : "text-destructive-foreground"
                        }
                      >
                        {choice.effects.beaHealth > 0 ? "+" : ""}
                        {choice.effects.beaHealth}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm font-semibold">Costo: ${choice.cost.toLocaleString()}</span>
                  <Button onClick={() => onChoose(choice)} disabled={!canAfford} size="sm">
                    {canAfford ? "Elegir" : "Sin fondos"}
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </Card>
  )
}
