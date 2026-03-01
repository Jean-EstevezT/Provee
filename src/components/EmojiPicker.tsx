import { useState } from 'react'
import { emojiGroups } from '../data/emojis'
import { Search } from 'lucide-react'

interface Props {
    selected: string
    onSelect: (emoji: string) => void
}

export default function EmojiPicker({ selected, onSelect }: Props) {
    const [search, setSearch] = useState('')

    // Filter groups by label when searching
    const filteredGroups = search.trim()
        ? emojiGroups.filter((g) =>
            g.label.toLowerCase().includes(search.toLowerCase()),
        )
        : emojiGroups

    return (
        <div className="emoji-picker">
            <div className="emoji-picker-search">
                <Search size={14} className="emoji-picker-search-icon" />
                <input
                    type="text"
                    placeholder="Buscar grupo…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="emoji-picker-groups">
                {filteredGroups.map((group) => (
                    <div key={group.label} className="emoji-group">
                        <span className="emoji-group-label">{group.label}</span>
                        <div className="emoji-grid">
                            {group.emojis.map((emoji, i) => (
                                <button
                                    key={`${emoji}-${i}`}
                                    type="button"
                                    className={`emoji-btn ${selected === emoji ? 'emoji-btn--selected' : ''}`}
                                    onClick={() => onSelect(emoji)}
                                    title={emoji}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
