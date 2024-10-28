'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Importar el hook de navegación
import { Card, CardContent } from '../components/card';
import { Button } from '../components/button';

const Notes = () => {
 const [notes, setNotes] = useState([]); // Estado para almacenar las notas
  return(
    <Card>
      <Button>
        See your notes
      </Button>
    </Card>
  );
}
export default Notes
